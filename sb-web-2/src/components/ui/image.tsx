import { forwardRef, type ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ width, height, fill, priority: _priority, className, ...props }, ref) => (
    <img
      ref={ref}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={fill ? `absolute inset-0 size-full ${className ?? ""}` : className}
      {...props}
    />
  ),
);

Image.displayName = "Image";

export default Image;