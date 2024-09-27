import { ReactNode } from "react";

export default function Owner({ children }: { children: ReactNode }) {
    if (!children) {
        return (
            <> Co cai con meo</>
        )
    }
    return (
        <>{children}</>
    )

}