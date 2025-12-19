# Quill.js Integration Guide

## 🎯 Overview

This integration provides a complete rich text editor solution with:

- Quill.js rich text editor with Snow theme
- Content save/load functionality via PocketBase
- Image upload handling
- Hungarian UI text

## 📁 File Structure

```
/public/js/
  ├── quill/
  │   ├── quill.js (209KB) - Main Quill bundle
  │   ├── quill.js.map - Source map
  │   └── quill.d.ts - TypeScript definitions
  └── richtext.js - Custom Quill integration with PocketBase

/public/css/quill/
  ├── quill.core.css - Core styles
  └── quill.snow.css - Snow theme styles
```

## 🔧 Configuration

### Basic Setup

```html
<!-- In your layout: -->
<div
  id="editor"
  data-key="your-content-key"
></div>
<button
  id="save-button"
  class="btn btn-primary"
>
  Mentés
</button>

<!-- Scripts loaded via Astro layout scripts property -->
```

### Available Functions

The integration exposes `window.quillAPI` with these functions:

#### `saveContent()` - Save current content to PocketBase

- Automatically updates or creates content record
- Uses `data-key` from editor element as record key
- Shows loading state on button

#### `getContent()` - Get current HTML content

```javascript
const html = window.quillAPI.getContent();
```

#### `setContent(html)` - Set editor content

```javascript
window.quillAPI.setContent("<p>Hello world</p>");
```

## 🖼️ Quill Features

### Toolbar (Default Configuration)

- Headers (H1, H2, H3)
- Text formatting: Bold, Italic, Underline, Strike
- Lists: Ordered, Unordered
- Links
- Clear formatting

### Supported Formats

- **bold**, _italic_, ~~strike~~
- Headers: # ## ###
- Lists: 1. 2.
- Links: [text](url)
- Images: 📸 (with alt text)

## 📸 Image Handling

### Automatic Features

- **Paste images** from clipboard (auto-uploads to PocketBase)
- **Drag & drop** image files
- **Base64 fallback** if upload fails
- **Alt text** support

### Manual Image Usage

Images are automatically inserted when:

1. Pasting an image from clipboard
2. Dragging an image file onto the editor
3. Images are stored in PocketBase 'image' collection

## 💾 PocketBase Integration

### Content Collection

```javascript
// Records are stored in 'content' collection with:
// - key: unique identifier (from data-key attribute)
// - value: HTML content from Quill editor
```

### Image Collection

```javascript
// Images are stored in 'image' collection with:
// - file: uploaded file
// - key: image identifier (for retrieval)
```

## 🚀 Usage Examples

### Loading Content on Page Load

```javascript
// Content automatically loads if data-key is present
// No additional code needed - handled by richtext.js
```

### Manual Content Operations

```javascript
// Get content
const content = window.quillAPI.getContent();

// Set content
window.quillAPI.setContent("<h1>New content</h1><p>With formatting</p>");

// Save content (with user feedback)
window.quillAPI.save();
```

### Custom Save Button

```html
<button onclick="window.quillAPI.save()">Save</button>
```

## 🎨 Styling

### CSS Variables (Customizable via quill-variables.css)

The Quill styles use CSS custom properties for easy theming:

```css
:root {
  --ql-color-base: #000;
  --ql-color-bg-base: #fff;
  --ql-toolbar-bg: #f5f5f5;
  /* ... and many more */
}
```

### Current Theme

- **Snow theme** (clean, modern interface)
- Responsive toolbar
- Hungarian placeholder text

## 🔍 Debugging

### Console Available

```javascript
// Access Quill instance directly
console.log(window.quill);

// Access API functions
console.log(window.quillAPI);

// Get current selection
const selection = window.quill.getSelection();
console.log("Selection:", selection);
```

### Common Issues

1. **Content not loading**: Check `data-key` attribute exists
2. **Save button not working**: Ensure `data-key` is present
3. **Images not uploading**: Check PocketBase connection and permissions

## 📋 HTML Template

```html
<div class="mb-4">
  <div
    id="editor"
    data-key="bio"
  ></div>
  <button
    id="save-button"
    class="btn btn-primary"
  >
    Mentés
  </button>
</div>
```

## 🔄 Integration with Existing Code

The richtext.js integrates with your existing:

- `db.js` - PocketBase connection
- `content-manager.js` - Content management pattern
- Edit button toggle system

## 🎯 Next Steps

1. **Customize toolbar**: Modify toolbar options in richtext.js
2. **Add validation**: Implement content validation before save
3. **Auto-save**: Add periodic save functionality
4. **Export formats**: Add PDF, Markdown export options
5. **Custom themes**: Override CSS variables for custom styling

## 🐛 Troubleshooting

### Content Not Saving

- Check PocketBase is connected
- Verify user has write permissions
- Check browser console for errors

### Images Not Working

- Verify PocketBase image collection exists
- Check file size limits
- Test with different image formats

### Editor Not Loading

- Verify quill.js is loading correctly
- Check browser console for JavaScript errors
- Ensure `#editor` element exists on page
