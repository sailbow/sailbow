import Image from "next/image"
import { z } from "zod";

const helmSpinnerPropsSchema = z
  .object({
    size: z.number().min(1).default(25)
  })

type HelmSpinnerProps = z.input<typeof helmSpinnerPropsSchema>

export default function HelmSpinner(props: HelmSpinnerProps): JSX.Element {
  const { size } = helmSpinnerPropsSchema.parse(props)
  const css = `
    .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      
      .spinner-image {
        animation: spin 2s linear infinite;
      }
      
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `

  return (
    <>
      <style>{css}</style>
      <div className="spinner">
        <Image
          src="/helm.svg"
          alt="Ship Helm"
          className="spinner-image"
          width={size}
          height={size}
        />
      </div>
    </>
  );
};