'use client';

import { AnimationType } from '@/lib/types';
import { useEffect, useRef } from 'react';

interface BackgroundAnimationProps {
    type: AnimationType;
}

export default function BackgroundAnimation({ type }: BackgroundAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (type === 'none' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId: number;
        const particles: any[] = [];

        // Rain animation
        if (type === 'rain') {
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: Math.random() * 20 + 10,
                    speed: Math.random() * 5 + 5,
                });
            }

            const animateRain = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
                ctx.lineWidth = 1;

                particles.forEach((drop) => {
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.length);
                    ctx.stroke();

                    drop.y += drop.speed;
                    if (drop.y > canvas.height) {
                        drop.y = -drop.length;
                        drop.x = Math.random() * canvas.width;
                    }
                });

                animationId = requestAnimationFrame(animateRain);
            };

            animateRain();
        }

        // Stars animation
        if (type === 'stars') {
            for (let i = 0; i < 200; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    increasing: Math.random() > 0.5,
                });
            }

            const animateStars = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach((star) => {
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fill();

                    if (star.increasing) {
                        star.opacity += star.twinkleSpeed;
                        if (star.opacity >= 1) star.increasing = false;
                    } else {
                        star.opacity -= star.twinkleSpeed;
                        if (star.opacity <= 0) star.increasing = true;
                    }
                });

                animationId = requestAnimationFrame(animateStars);
            };

            animateStars();
        }

        // Waves animation (SVG-based, simpler)
        if (type === 'waves') {
            // For waves, we'll use CSS animation instead of canvas
            // This is handled in the component's JSX below
        }

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [type]);

    if (type === 'waves') {
        return (
            <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path
                        fill="rgba(6, 182, 212, 0.3)"
                        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        className="animate-wave"
                    >
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="translate"
                            from="0 0"
                            to="-1440 0"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <path
                        fill="rgba(6, 182, 212, 0.2)"
                        d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,160C672,139,768,117,864,117.3C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        className="animate-wave-slow"
                    >
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="translate"
                            from="0 0"
                            to="-1440 0"
                            dur="15s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
            </div>
        );
    }

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
