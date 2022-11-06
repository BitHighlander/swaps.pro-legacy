import { IconButton } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { FaCheck, FaClipboard } from "react-icons/fa";

export const CopyIconButton: FC<{ copyString: string }> = ({ copyString }) => {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }, [copied])

    return (
        <IconButton aria-label='copy address'
            disabled={copied}
            icon={copied ? <FaCheck /> : <FaClipboard />}
            size='xs'
            colorScheme={copied ? "green" : "blue"}
            onClick={(e) => {
                navigator.clipboard.writeText(copyString).then(() => {
                    setCopied(true)
                });
            }} />
    )
}