# Loader and Lazy Loading Implementation

This implementation adds an initial loader and lazy loading functionality to the website to improve user experience and performance.

## Features Implemented

### 1. Initial Loader (`Loader.tsx`)
- **Purpose**: Shows a loading screen when the website first loads
- **Duration**: Minimum 2.5 seconds to ensure all content has time to load
- **Design**: Modern spinner with company branding and progress indication
- **Behavior**: Automatically hides when page is fully loaded

### 2. Lazy Loading Components (`LazyComponent.tsx`)
- **Purpose**: Loads components only when they come into view
- **Technology**: Uses Intersection Observer API
- **Fallback**: Shows skeleton loading animation while content loads
- **Customizable**: Configurable threshold and root margin

### 3. Lazy Loading Images (`LazyImage.tsx`)
- **Purpose**: Loads images only when they're about to be visible
- **Features**: 
  - Placeholder animation while loading
  - Error handling with fallback UI
  - Smooth fade-in transition when loaded
- **Performance**: Reduces initial page load time

### 4. Loading Hook (`useInitialLoader.ts`)
- **Purpose**: Manages the initial loading state
- **Features**:
  - Configurable minimum load time
  - Waits for all resources to load
  - Provides loading state management

## Implementation Details

### Files Modified/Created:
1. `frontend/src/app/component/Loader.tsx` - Initial loader component
2. `frontend/src/app/component/LazyComponent.tsx` - Lazy loading wrapper
3. `frontend/src/app/component/LazyImage.tsx` - Lazy loading for images
4. `frontend/src/app/hooks/useInitialLoader.ts` - Loading state hook
5. `frontend/src/app/ConditionalLayout.tsx` - Integrated loader
6. `frontend/src/app/page.tsx` - Applied lazy loading to home components
7. `frontend/src/app/component/Home/Hero.tsx` - Added lazy loading to hero content
8. `frontend/src/app/globals.css` - Added custom animations

### Usage Examples:

#### Using LazyComponent:
```tsx
import LazyComponent from './component/LazyComponent';

<LazyComponent>
  <YourComponent />
</LazyComponent>
```

#### Using LazyImage:
```tsx
import LazyImage from './component/LazyImage';

<LazyImage 
  src="/path/to/image.jpg" 
  alt="Description" 
  className="w-full h-64"
/>
```

#### Using the Loading Hook:
```tsx
import { useInitialLoader } from './hooks/useInitialLoader';

const { isLoading, setLoading } = useInitialLoader(3000); // 3 seconds
```

## Performance Benefits

1. **Faster Initial Load**: Only critical content loads immediately
2. **Reduced Bandwidth**: Images and components load on-demand
3. **Better UX**: Smooth loading animations and transitions
4. **SEO Friendly**: Content is still accessible to search engines

## Browser Support

- **Intersection Observer**: Supported in all modern browsers
- **CSS Animations**: Supported in all browsers
- **Fallbacks**: Graceful degradation for older browsers

## Testing

Run the test script in browser console:
```javascript
// Copy and paste the content from test-loader-lazy.js
```

## Customization

### Loader Duration:
```tsx
const { isLoading } = useInitialLoader(5000); // 5 seconds
```

### Lazy Loading Threshold:
```tsx
<LazyComponent threshold={0.2} rootMargin="100px">
  <YourComponent />
</LazyComponent>
```

### Custom Fallback:
```tsx
<LazyComponent fallback={<CustomSkeleton />}>
  <YourComponent />
</LazyComponent>
```

## Notes

- The loader only appears on public pages, not admin routes
- All animations are optimized for performance
- Error handling is included for failed image loads
- The implementation is fully responsive and accessible
