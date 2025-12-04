# Drag and Drop Implementation for Image Upload

## Current State Analysis

### ImageUpload.astro Component

- Drop zone area: `<label>` element (lines 17-28) with dashed border styling
- Hidden file input: `<input type="file" multiple>` (lines 35-42)
- File list container: `<ul data-files>` (lines 29-33)
- File row template: `<template id="file-row">` (lines 54-64)

### images.js JavaScript Module

- Uses `DataTransfer` object for file management
- Functions: `removeFile()`, `updateFileList()`, `initUploadForm()`
- Handles file input changes and PocketBase uploads
- Event listener on input change (line 59)

## Implementation Plan

### 1. Event Handlers Required

Add to the drop zone label element:

```javascript
// Prevent default browser behavior
dragenter: (e) => e.preventDefault();
dragover: (e) => e.preventDefault();

// Visual feedback
dragenter: () => dropZone.classList.add("drag-active");
dragleave: () => dropZone.classList.remove("drag-active");

// File processing
drop: (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  processDroppedFiles(files);
};
```

### 2. Integration Points

#### Reuse Existing Logic

- Use current `DataTransfer` object (`dt`) for file management
- Integrate with existing `updateFileList()` function
- Apply same file deduplication logic (lines 64-70)

#### File Processing Function

```javascript
function processDroppedFiles(files) {
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      // Same logic as input change handler
      if (!isDuplicate(file)) {
        dt.items.add(file);
      }
    }
  });

  input.files = dt.files;
  updateFileList([...dt.files]);
}
```

### 3. Visual Feedback Classes

Add to ImageUpload.astro drop zone:

```css
/* Current: border-base-300 hover:border-base-content */
/* Add drag states: */
.drag-active {
  @apply border-primary bg-primary/5 scale-[1.02];
}

.drag-over {
  @apply border-primary/70;
}
```

### 4. Implementation Location

#### JavaScript Changes (images.js)

- Add drag event listeners in `initUploadForm()` function
- Target the label element: `document.querySelector('label[for="file-upload"]')`
- Insert after existing input event listener (after line 74)

#### CSS Changes (ImageUpload.astro)

- Add drag state classes to the label element
- Include transition classes for smooth visual feedback

## Technical Considerations

### File Validation

- Check `file.type.startsWith('image/')` for image files only
- Maintain existing size/name deduplication logic
- Handle multiple files dropped simultaneously

### Browser Compatibility

- `DataTransfer.files` is well-supported
- `e.dataTransfer.files` works in all modern browsers
- No polyfills required

### User Experience

- Clear visual feedback during drag operations
- Smooth transitions using TailwindCSS classes
- Maintain existing keyboard accessibility (tabindex="0")

## Code Integration Points

1. **Event Listener Setup**: Add to `initUploadForm()` after line 74
2. **Drop Zone Selection**: Target `label[for="file-upload"]`
3. **File Processing**: Reuse lines 62-73 logic for dropped files
4. **Visual States**: Extend existing hover styles with drag classes
