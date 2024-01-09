import React from 'react';
import '../style/components/loader.css';
export interface LoadingProps {
    status?: boolean;
    addclass?: string;
    colorCode?: string;
}
const Loading: React.FC<LoadingProps> = ({ status = true, addclass, colorCode }) => {
    return (
        <>
            {status && (
                <div className="pos-relative h-100 loading-center">
                    <div className={`loading-wrap ${addclass}`}>
                        <svg className="spinner" viewBox="0 0 50 50">
                            <circle
                                className="path stroke-current text-primary-100"
                                cx="25"
                                cy="25"
                                r="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                color={colorCode}
                            />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};
export default Loading;