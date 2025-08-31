import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 50, color = '#3aaed8' }) => {
    return (
        <div
            className="spinner"
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="spinner__segment"
                    style={{
                        backgroundColor: color,
                        transform: `rotate(${i * 30}deg)`,
                        animationDelay: `${-1.1 + i * 0.1}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default LoadingSpinner;
