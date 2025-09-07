import { useRef, useState, useEffect } from "react";
import {Turnstile} from "@marsidev/react-turnstile";

function Beta() {
    const [playing, setPlaying] = useState(false);
    const [captchaPassed, setCaptchaPassed] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!playing || !videoRef.current) return;

        (async () => {
            setCaptchaPassed(true);
            try {
                await videoRef.current!.play();
            } catch (e) {
                setPlaying(false);
            }

            const elem = containerRef.current;
            if (elem) {
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if ('webkitRequestFullscreen' in elem) {
                    await (elem as any).webkitRequestFullscreen();
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (screen.orientation && screen.orientation.lock) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await screen.orientation.lock("landscape");
            }
        })();
    }, [playing]);


    return (
        <div
            ref={containerRef}
            onClick={() => setPlaying(true)}
            style={{ width: "100vw", height: "100vh", cursor: playing ? "none" : "default"}}
        >
            {playing && (
                <video
                    src="/vid.mp4"
                    ref={videoRef}
                    controls={false}
                    disablePictureInPicture
                    playsInline
                    height="100%"
                    width="100%"
                    style={{objectFit: "fill"}}
                    loop
                />
            )}

            {!playing && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000",
                    }}
                >
                    <Turnstile
                        siteKey="0x4AAAAAABrdvnUK7FIF7cxe"
                        onSuccess={() => {
                            setPlaying(true);
                            setCaptchaPassed(true)
                        }}
                        onError={() => {
                            setCaptchaPassed(true)
                        }}
                    />
                </div>
            )}

            {captchaPassed && !playing && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000",
                    }}
                >
                    <button onClick={() => setPlaying(true)} style={{padding: "20px", fontSize: "20px", cursor: "pointer"}} />
                </div>
            )}
        </div>
    );
}

export default Beta;