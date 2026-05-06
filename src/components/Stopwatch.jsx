import React, { useEffect, useMemo, useRef, useState } from "react";
import { Flag, Pause, Play, RotateCcw, Timer, Trash2 } from "lucide-react";

function formatTime(milliseconds) {
  const totalCentiseconds = Math.floor(milliseconds / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const pad = (value, size = 2) => String(value).padStart(size, "0");

  return {
    main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    fraction: pad(centiseconds),
  };
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);

    return () => window.clearInterval(intervalRef.current);
  }, [isRunning, elapsed]);

  const display = useMemo(() => formatTime(elapsed), [elapsed]);
  const latestLap = laps[0]?.time || 0;

  const handleStartPause = () => {
    setIsRunning((value) => !value);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (elapsed === 0) {
      return;
    }

    setLaps((currentLaps) => [
      {
        id: crypto.randomUUID(),
        number: currentLaps.length + 1,
        time: elapsed,
        split: elapsed - latestLap,
      },
      ...currentLaps,
    ]);
  };

  const clearLaps = () => {
    setLaps([]);
  };

  return (
    <main className="app-shell">
      <section className="stopwatch-panel" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">PRODIGY_WD_02</p>
          <h1 id="page-title">Stopwatch Web Application</h1>
          <p>
            Start, pause, reset, and record lap times with a responsive stopwatch
            interface built using React, CSS, and JavaScript.
          </p>
        </div>

        <div className="watch-card">
          <div className="timer-badge">
            <Timer size={20} />
            <span>{isRunning ? "Running" : elapsed > 0 ? "Paused" : "Ready"}</span>
          </div>

          <div className="time-display" aria-live="polite">
            <span>{display.main}</span>
            <small>.{display.fraction}</small>
          </div>

          <div className="controls" aria-label="Stopwatch controls">
            <button
              className={`control-button ${isRunning ? "control-button--pause" : "control-button--start"}`}
              type="button"
              onClick={handleStartPause}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? "Pause" : "Start"}
            </button>

            <button className="control-button" type="button" onClick={handleLap} disabled={elapsed === 0}>
              <Flag size={20} />
              Lap
            </button>

            <button className="control-button" type="button" onClick={handleReset} disabled={elapsed === 0 && laps.length === 0}>
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="laps-panel" aria-labelledby="laps-title">
        <div className="laps-header">
          <div>
            <p className="eyebrow">Lap History</p>
            <h2 id="laps-title">Recorded intervals</h2>
          </div>
          <button className="icon-button" type="button" onClick={clearLaps} disabled={laps.length === 0} aria-label="Clear lap history">
            <Trash2 size={18} />
          </button>
        </div>

        {laps.length === 0 ? (
          <div className="empty-state">
            <Flag size={30} />
            <p>No laps recorded yet.</p>
          </div>
        ) : (
          <ol className="lap-list">
            {laps.map((lap) => {
              const lapTime = formatTime(lap.time);
              const splitTime = formatTime(lap.split);

              return (
                <li className="lap-item" key={lap.id}>
                  <span>Lap {lap.number}</span>
                  <strong>
                    {lapTime.main}.{lapTime.fraction}
                  </strong>
                  <small>
                    +{splitTime.main}.{splitTime.fraction}
                  </small>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
