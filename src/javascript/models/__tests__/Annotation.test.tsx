import Annotation, { 
  AnnotationCategory, 
  AnnotationColor, 
  ADDED_ANNOTATION, 
  REMOVED_ANNOTATION, 
  UNCHANGED_ANNOTATION, 
  DETECTED_ANNOTATION, 
  MODIFIED_ANNOTATION 
} from '../Annotation';

describe('Annotation', () => {
  it('should create an annotation with category and color', () => {
    const annotation = new Annotation({
      category: AnnotationCategory.ADDED,
      color: AnnotationColor.GREEN
    });

    expect(annotation.category).toBe(AnnotationCategory.ADDED);
    expect(annotation.color).toBe(AnnotationColor.GREEN);
  });

  it('should compare annotations for equality', () => {
    const annotation1 = new Annotation({
      category: AnnotationCategory.ADDED,
      color: AnnotationColor.GREEN
    });

    const annotation2 = new Annotation({
      category: AnnotationCategory.ADDED,
      color: AnnotationColor.GREEN
    });

    const annotation3 = new Annotation({
      category: AnnotationCategory.REMOVED,
      color: AnnotationColor.RED
    });

    expect(annotation1.equals(annotation2)).toBe(true);
    expect(annotation1.equals(annotation3)).toBe(false);
  });

  it('should convert annotation to string representation', () => {
    const annotation = new Annotation({
      category: AnnotationCategory.MODIFIED,
      color: AnnotationColor.BROWN
    });

    expect(annotation.toString()).toBe('Modified (brown)');
  });

  it('should have predefined annotation constants', () => {
    expect(ADDED_ANNOTATION.category).toBe(AnnotationCategory.ADDED);
    expect(ADDED_ANNOTATION.color).toBe(AnnotationColor.GREEN);

    expect(REMOVED_ANNOTATION.category).toBe(AnnotationCategory.REMOVED);
    expect(REMOVED_ANNOTATION.color).toBe(AnnotationColor.RED);

    expect(UNCHANGED_ANNOTATION.category).toBe(AnnotationCategory.UNCHANGED);
    expect(UNCHANGED_ANNOTATION.color).toBe(AnnotationColor.BROWN);

    expect(DETECTED_ANNOTATION.category).toBe(AnnotationCategory.DETECTED);
    expect(DETECTED_ANNOTATION.color).toBe(AnnotationColor.GREEN);

    expect(MODIFIED_ANNOTATION.category).toBe(AnnotationCategory.MODIFIED);
    expect(MODIFIED_ANNOTATION.color).toBe(AnnotationColor.GREEN);
  });

  it('should handle all annotation categories', () => {
    const categories = [
      AnnotationCategory.ADDED,
      AnnotationCategory.REMOVED,
      AnnotationCategory.UNCHANGED,
      AnnotationCategory.DETECTED,
      AnnotationCategory.MODIFIED
    ];

    const colors = [
      AnnotationColor.GREEN,
      AnnotationColor.RED,
      AnnotationColor.BROWN
    ];

    categories.forEach(category => {
      colors.forEach(color => {
        const annotation = new Annotation({ category, color });
        expect(annotation.category).toBe(category);
        expect(annotation.color).toBe(color);
      });
    });
  });
}); 