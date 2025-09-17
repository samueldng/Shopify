import React, { useState, useEffect } from 'react';
import { Clock, Package, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import '../styles/stock-countdown.css';

interface StockCountdownProps {
  stock: number;
  lowStockThreshold?: number;
  showCountdown?: boolean;
  countdownEndTime?: Date;
  variant?: 'default' | 'urgent' | 'low';
  className?: string;
  maxStock?: number;
  showProgress?: boolean;
  animated?: boolean;
}

const StockCountdown: React.FC<StockCountdownProps> = ({
  stock,
  lowStockThreshold = 5,
  showCountdown = false,
  countdownEndTime,
  variant = 'default',
  className = '',
  maxStock = 100,
  showProgress = false,
  animated = true
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [prevTimeLeft, setPrevTimeLeft] = useState(timeLeft);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (!showCountdown || !countdownEndTime) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = countdownEndTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const newTimeLeft = { hours, minutes, seconds };
        
        // Trigger flip animation if seconds changed
        if (animated && newTimeLeft.seconds !== timeLeft.seconds) {
          setIsFlipping(true);
          setTimeout(() => setIsFlipping(false), 600);
        }
        
        setPrevTimeLeft(timeLeft);
        setTimeLeft(newTimeLeft);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown, countdownEndTime]);

  const getStockStatus = () => {
    if (stock === 0) return 'out';
    if (stock <= lowStockThreshold) return 'low';
    return 'available';
  };

  const getStockColor = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out':
        return 'stock-out';
      case 'low':
        return 'stock-low';
      default:
        return 'stock-available';
    }
  };

  const getStockProgress = () => {
    return Math.max(0, Math.min(100, (stock / maxStock) * 100));
  };

  const getProgressBarClass = () => {
    const status = getStockStatus();
    switch (status) {
      case 'out':
        return 'urgent';
      case 'low':
        return 'low';
      default:
        return 'available';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return 'countdown-urgent';
      case 'low':
        return 'countdown-low';
      default:
        return 'countdown-timer';
    }
  };

  const stockStatus = getStockStatus();

  if (stock === 0) {
    return (
      <div className={`stock-countdown-container ${className}`}>
        <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg stock-status-badge ${getStockColor()}`}>
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Esgotado</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`stock-countdown-container space-y-3 ${className}`}>
      {/* Stock Status */}
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg stock-status-badge ${getStockColor()}`}>
        {stockStatus === 'low' ? (
          <Zap className="w-4 h-4" />
        ) : (
          <Package className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {stockStatus === 'low' ? (
            <>Apenas {stock} restantes!</>
          ) : (
            <>{stock} em estoque</>
          )}
        </span>
        {stockStatus === 'low' && (
          <TrendingUp className="w-4 h-4 ml-1" />
        )}
      </div>

      {/* Stock Progress Bar */}
      {showProgress && (
        <div className="stock-progress">
          <div 
            className={`stock-progress-bar ${getProgressBarClass()}`}
            style={{ width: `${getStockProgress()}%` }}
          />
        </div>
      )}

      {/* Countdown Timer */}
      {showCountdown && countdownEndTime && (
        <div className={`inline-flex items-center space-x-4 px-6 py-4 rounded-xl ${getVariantStyles()}`}>
          <Clock className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-wide">
              {variant === 'urgent' ? 'OFERTA TERMINA EM:' : 'Tempo restante:'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`timer-digit ${isFlipping ? 'flip' : ''}`}>
              <div className="text-xl font-bold leading-none">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="timer-label">horas</div>
            </div>
            <div className="text-xl font-bold text-white/60">:</div>
            <div className={`timer-digit ${isFlipping ? 'flip' : ''}`}>
              <div className="text-xl font-bold leading-none">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="timer-label">min</div>
            </div>
            <div className="text-xl font-bold text-white/60">:</div>
            <div className={`timer-digit ${isFlipping ? 'flip' : ''}`}>
              <div className="text-xl font-bold leading-none">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="timer-label">seg</div>
            </div>
          </div>
        </div>
      )}

      {/* Urgency Messages */}
      {stockStatus === 'low' && (
        <div className="urgency-message bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="ping-indicator w-3 h-3 bg-orange-500 rounded-full" />
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Estoque baixo!</span> Apenas {stock} unidades restantes.
            </p>
          </div>
        </div>
      )}

      {/* Flash Sale Message */}
      {variant === 'urgent' && (
        <div className="flash-sale-message rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="ping-indicator w-3 h-3 bg-red-500 rounded-full" />
            <Zap className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              <span className="font-bold">Oferta Relâmpago!</span> Preço especial por tempo limitado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCountdown;