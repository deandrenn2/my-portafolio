const TextNeon = ({ text, className }: { text: string, className?: string }) => {
    return (
        <h2 className={`text-neon ${className}`}>
            {text}
        </h2>
    )
}
export default TextNeon