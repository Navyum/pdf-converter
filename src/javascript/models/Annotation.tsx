// 注解类型枚举
export enum AnnotationCategory {
  ADDED = 'Added',
  REMOVED = 'Removed',
  UNCHANGED = 'Unchanged',
  DETECTED = 'Detected',
  MODIFIED = 'Modified'
}

// 注解颜色枚举
export enum AnnotationColor {
  GREEN = 'green',
  RED = 'red',
  BROWN = 'brown'
}

// 注解选项接口
export interface AnnotationOptions {
  category: AnnotationCategory;
  color: AnnotationColor;
}

// 文本项的注解
export default class Annotation {
  category: AnnotationCategory;
  color: AnnotationColor;

  constructor(options: AnnotationOptions) {
    this.category = options.category;
    this.color = options.color;
  }

  // 比较两个注解是否相同
  equals(other: Annotation): boolean {
    return this.category === other.category && this.color === other.color;
  }

  // 转换为字符串表示
  toString(): string {
    return `${this.category} (${this.color})`;
  }
}

// 预定义的注解常量
export const ADDED_ANNOTATION = new Annotation({
  category: AnnotationCategory.ADDED,
  color: AnnotationColor.GREEN
});

export const REMOVED_ANNOTATION = new Annotation({
  category: AnnotationCategory.REMOVED,
  color: AnnotationColor.RED
});

export const UNCHANGED_ANNOTATION = new Annotation({
  category: AnnotationCategory.UNCHANGED,
  color: AnnotationColor.BROWN
});

export const DETECTED_ANNOTATION = new Annotation({
  category: AnnotationCategory.DETECTED,
  color: AnnotationColor.GREEN
});

export const MODIFIED_ANNOTATION = new Annotation({
  category: AnnotationCategory.MODIFIED,
  color: AnnotationColor.GREEN
}); 