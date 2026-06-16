const TextNeonSvg = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={className}>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="572" height="81" viewBox="0 0 572 81">
                <defs>
                    <filter id="Developer_Web_FullStack" x="0" y="0" width="572" height="81" filterUnits="userSpaceOnUse">
                        <feOffset dy="3" in="SourceGraphic" />
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodColor="#2272ff" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                    </filter>
                </defs>
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Developer_Web_FullStack)">
                    <text id="Developer_Web_FullStack-2" data-name={text} transform="translate(272 58)" fill="#2272ff" stroke="#508fff" stroke-width="1" font-size="39" font-family="Obviously-Regu, Obviously"><tspan x="-275.164" y="0">{text}</tspan></text>
                </g>
            </svg>
        </div>
    )
}

export default TextNeonSvg
