#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/../backups"

# Create backup directory
mkdir -p "$BACKUP_DIR"

show_usage() {
    echo "Database Management Tool"
    echo "======================="
    echo ""
    echo "Usage:"
    echo "  $0 <action> <environment> [path]"
    echo ""
    echo "Actions:"
    echo "  backup     - Create backup of specified environment"
    echo "  restore    - Restore backup to specified environment"
    echo ""
    echo "Environments:"
    echo "  dev        - Development environment"
    echo "  prod       - Production environment"
    echo ""
    echo "Path:"
    echo "  For backup: Optional - specifies backup file path (auto-generated if not provided)"
    echo "  For restore: Required - path to backup file to restore"
    echo ""
    echo "Utilities:"
    echo "  $0 list    - List all available backups in ./backups/"
    echo "  $0 clean   - Clean old backups (keeps latest 5)"
    echo ""
    echo "Examples:"
    echo "  $0 backup dev                    - Backup dev database"
    echo "  $0 backup prod /tmp/custom.db     - Backup prod to custom path"
    echo "  $0 restore dev ./backups/prod_backup_20250108_133128.db"
    echo "  $0 restore prod ./backups/prod_backup.db"
}

backup_env() {
    local env=$1
    local custom_path=$2
    
    if [ "$env" = "dev" ]; then
        backup_dev "$custom_path"
    elif [ "$env" = "prod" ]; then
        backup_prod "$custom_path"
    else
        echo "Error: Invalid environment. Use 'dev' or 'prod'"
        exit 1
    fi
}

restore_env() {
    local env=$1
    local backup_path=$2
    
    if [ -z "$backup_path" ]; then
        echo "Error: Backup path required for restore"
        exit 1
    fi
    
    if [ "$env" = "dev" ]; then
        restore_dev "$backup_path"
    elif [ "$env" = "prod" ]; then
        restore_prod "$backup_path"
    else
        echo "Error: Invalid environment. Use 'dev' or 'prod'"
        exit 1
    fi
}

backup_dev() {
    local custom_path=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_name="dev_backup_${timestamp}"
    
    if [ -n "$custom_path" ]; then
        backup_path="$custom_path"
        backup_name=$(basename "$custom_path" .db)
    else
        backup_path="$BACKUP_DIR/${backup_name}.db"
    fi
    
    echo "Creating development backup: $(basename "$backup_path")"
    
    # Create directory if custom path
    if [ -n "$custom_path" ]; then
        mkdir -p "$(dirname "$backup_path")"
    fi
    
    # Backup database
    cp "$SCRIPT_DIR/../pb/pb_data/data.db" "$backup_path"
    
    # Backup storage files (if exists) - only for auto-generated backups
    if [ -z "$custom_path" ] && [ -d "$SCRIPT_DIR/../pb/pb_data/storage" ]; then
        tar -czf "$BACKUP_DIR/${backup_name}_storage.tar.gz" -C "$SCRIPT_DIR/../pb/pb_data" storage
        echo "✓ Storage backup completed: ${backup_name}_storage.tar.gz"
    elif [ -z "$custom_path" ]; then
        echo "⚠ No storage directory found - skipping storage backup"
    fi
    
    echo "✓ Development backup completed: $(basename "$backup_path")"
}

backup_prod() {
    local custom_path=$1
    local server="peti@shared"
    local remote_path="/home/peti/projects/szarvaspongrac/pb"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_name="prod_backup_${timestamp}"
    
    if [ -n "$custom_path" ]; then
        backup_path="$custom_path"
        backup_name=$(basename "$custom_path" .db)
        mkdir -p "$(dirname "$backup_path")"
    else
        backup_path="$BACKUP_DIR/${backup_name}.db"
    fi
    
    echo "Creating production backup: $(basename "$backup_path")"
    
    # Create backup on remote server
    ssh "$server" "cd '$remote_path' && cp pb_data/data.db pb_data/data.db.backup_$timestamp"
    
    # Download backup
    scp "$server:$remote_path/pb_data/data.db.backup_$timestamp" "$backup_path"
    
    # Backup storage files (if auto-generated backup)
    if [ -z "$custom_path" ]; then
        ssh "$server" "cd '$remote_path' && tar -czf pb_data/storage_backup_$timestamp.tar.gz -C pb_data storage"
        scp "$server:$remote_path/pb_data/storage_backup_$timestamp.tar.gz" "$BACKUP_DIR/${backup_name}_storage.tar.gz"
        echo "✓ Storage backup completed: ${backup_name}_storage.tar.gz"
    fi
    
    # Clean up remote files
    ssh "$server" "rm '$remote_path/pb_data/data.db.backup_$timestamp' '$remote_path/pb_data/storage_backup_$timestamp.tar.gz'"
    
    echo "✓ Production backup completed: $(basename "$backup_path")"
}

restore_dev() {
    local backup_path=$1
    
    if [ ! -f "$backup_path" ]; then
        echo "Error: Backup not found: $backup_path"
        exit 1
    fi
    
    # Determine file types and find pairs
    local backup_dir
    backup_dir=$(dirname "$backup_path")

    if [[ "$backup_path" == *".db" ]]; then
        db_file="$backup_path"
        backup_base=$(basename "$backup_path" .db)
        storage_file="$backup_dir/${backup_base}_storage.tar.gz"
    elif [[ "$backup_path" == *"_storage.tar.gz" ]]; then
        storage_file="$backup_path"
        backup_base=$(basename "$backup_path" "_storage.tar.gz")
        db_file="$backup_dir/${backup_base}.db"
    else
        echo "Error: Invalid backup file. Must be .db or _storage.tar.gz"
        exit 1
    fi
    
    echo "WARNING: This will replace current development database"
    echo "Backup to restore: $(basename "$backup_path") (database + storage)"
    echo ""
    echo -n "Continue? [y/N]: "
    read -r confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Operation cancelled"
        exit 1
    fi
    
    # Backup current database first (if it exists)
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    if [ -f "$SCRIPT_DIR/../pb/pb_data/data.db" ]; then
        cp "$SCRIPT_DIR/../pb/pb_data/data.db" "$SCRIPT_DIR/../pb/pb_data/data.db.backup_before_restore_${timestamp}"
        backup_msg="✓ Previous database backed up as: data.db.backup_before_restore_${timestamp}"
    else
        backup_msg="✓ No previous database to backup"
    fi
    
    # Restore database file if exists
    if [ -f "$db_file" ]; then
        cp "$db_file" "$SCRIPT_DIR/../pb/pb_data/data.db"
        echo "✓ Database restored from: $(basename "$db_file")"
    else
        echo "⚠ No database file found - skipping database"
    fi
    
    # Restore storage file if exists
    if [ -f "$storage_file" ]; then
        tar -xzf "$storage_file" -C "$SCRIPT_DIR/../pb/pb_data"
        echo "✓ Storage restored from: $(basename "$storage_file")"
    else
        echo "⚠ No storage file found - skipping storage"
    fi
    
    echo "✓ Development database restored from: $(basename "$backup_path")"
    echo "$backup_msg"
}

restore_prod() {
    local backup_path=$1
    local server="peti@shared"
    local remote_path="/home/peti/projects/szarvaspongrac/pb"
    
    if [ ! -f "$backup_path" ]; then
        echo "Error: Backup not found: $backup_path"
        exit 1
    fi
    
    echo "⚠️  PRODUCTION RESTORE - This will replace the production database!"
    echo "Backup to restore: $(basename "$backup_path") (database + storage)"
    echo ""
    echo -n "Continue? [y/N]: "
    read -r confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Operation cancelled"
        exit 1
    fi
    
    # Upload backup to production
    scp "$backup_path" "$server:$remote_path/pb_data/data.db.restore"
    
    # Restore on production server
    ssh "$server" "cd '$remote_path' && \
        echo 'Replacing production database...' && \
        mv pb_data/data.db pb_data/data.db.backup_before_restore_\$(date +%Y%m%d_%H%M%S) && \
        mv pb_data/data.db.restore pb_data/data.db && \
        echo '✓ Production database restored successfully'"
    
    echo "✓ Production database restored from: $(basename "$backup_path")"
    echo "✓ Previous production database backed up on server"
}

list_backups() {
    echo "Available backups:"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "No backups directory found"
        return
    fi
    
    echo "Development:"
    ls -1 "$BACKUP_DIR"/dev_backup_*.db 2>/dev/null | while read -r file; do
        if [ -f "$file" ]; then
            backup=$(basename "$file" .db)
            if [ -f "$BACKUP_DIR/${backup}_storage.tar.gz" ]; then
                echo "  $backup (with storage)"
            else
                echo "  $backup"
            fi
        fi
    done
    
    echo ""
    echo "Production:"
    ls -1 "$BACKUP_DIR"/prod_backup_*.db 2>/dev/null | while read -r file; do
        if [ -f "$file" ]; then
            backup=$(basename "$file" .db)
            if [ -f "$BACKUP_DIR/${backup}_storage.tar.gz" ]; then
                echo "  $backup (with storage)"
            else
                echo "  $backup"
            fi
        fi
    done
}

clean_backups() {
    echo "Cleaning old backups (keeping latest 5)..."
    
    # Clean development backups
    ls -1t "$BACKUP_DIR"/dev_backup_*.db 2>/dev/null | tail -n +6 | while read -r file; do
        if [ -f "$file" ]; then
            backup=$(basename "$file" .db)
            rm "$file" 2>/dev/null
            rm "$BACKUP_DIR/${backup}_storage.tar.gz" 2>/dev/null
            echo "Removed: $backup"
        fi
    done
    
    # Clean production backups
    ls -1t "$BACKUP_DIR"/prod_backup_*.db 2>/dev/null | tail -n +6 | while read -r file; do
        if [ -f "$file" ]; then
            backup=$(basename "$file" .db)
            rm "$file" 2>/dev/null
            rm "$BACKUP_DIR/${backup}_storage.tar.gz" 2>/dev/null
            echo "Removed: $backup"
        fi
    done
    
    echo "✓ Cleanup completed"
}

# Main command routing
case "$1" in
    backup)
        backup_env "$2" "$3"
        ;;
    restore)
        restore_env "$2" "$3"
        ;;
    list)
        list_backups
        ;;
    clean)
        clean_backups
        ;;
    *)
        show_usage
        exit 1
        ;;
esac