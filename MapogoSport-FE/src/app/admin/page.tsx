import { ReactNode } from "react";

export default function Owner({ children }: { children: ReactNode }) {
    if (!children) {
        return (
            <>Admin Ta Akinu</>
        )
    }
    return (
        { children }
    )

}