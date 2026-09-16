/**
 * Purely decorative ambient background: aurora blooms, a technical grid, a
 * slow scanline sweep and a vignette that keeps the focus in the middle of the
 * page.
 *
 * Hidden from assistive technology and never captures pointer events.
 */
function Backdrop() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 overflow-hidden"
        >
            {/* Technical grid, faded towards the edges by a radial mask. */}
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(80%_65%_at_50%_30%,#000,transparent)]" />

            {/* Aurora blooms */}
            <div className="animate-aurora absolute -top-48 left-[4%] size-[38rem] rounded-full bg-brand/25 blur-[130px]" />
            <div className="animate-aurora-slow absolute -bottom-56 right-[2%] size-[34rem] rounded-full bg-mark-x/20 blur-[140px]" />
            <div className="animate-aurora absolute top-1/4 -right-32 size-[30rem] rounded-full bg-mark-o/15 blur-[130px]" />

            {/* Broadcast-style scanline sweep */}
            <div className="animate-scan absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_38%,rgb(4_5_12/0.92)_100%)]" />
        </div>
    );
}

export default Backdrop;
