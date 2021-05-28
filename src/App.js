import {useState} from 'react';
import './App.css';
import { FaArrowDown, FaArrowUp, FaPlay, FaPause, FaSyncAlt } from 'react-icons/fa';

function App() {
  
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio] = useState(new Audio('./breaktime.mp3'));

  const playSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + 
      ":" + 
      (seconds < 10 ? "0" + seconds : seconds)
    );
 };

  const changeTime = (amount, type) => {
    if(type === "break"){
      if(breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime(prev => prev + amount);
    }
    else {
      if(sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime(prev => prev + amount);
      if(!timerOn){
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if(date > nextDate) {
          setDisplayTime(prev => {
            if(prev <= 0 && !onBreakVariable) {
              playSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            }
            else if(prev <= 0 && onBreakVariable) {
              playSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
           return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem('interval-id', interval)
    }

    if(timerOn) {
      clearInterval(localStorage.getItem('interval-id'));
    }

    setTimerOn(!timerOn);
  };
  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  }

  
  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>

      <div className="App-header">
        <div className="action-section">
          <Length 
            title = {"Break Length"} 
            changeTime ={changeTime} 
            type = {"break"} 
            time={breakTime} 
            formatTime={formatTime} 
            />
          <Length 
            title = {"Session Length"} 
            changeTime ={changeTime} 
            type = {"session"} 
            time={sessionTime} 
            formatTime={formatTime} 
          />
        </div>

        <div className="time-section">
          <h3>Session</h3>
          <h1>{formatTime(displayTime)}</h1>  

          <button onClick = {controlTime}>
            {timerOn ? <i><FaPause/></i> : <i><FaPlay/></i>}
          </button>

          <button onClick={resetTime}><i><FaSyncAlt/></i></button>
        </div>


      </div>
        <div className="footer">
          <footer>
            <p className="footer__text">
            © 2021 - Website developed by <a href="https://github.com/bishalmallick" target="_blank" rel="noopener noreferrer"> Bishal Mallick</a>
            </p>
          </footer>
        </div>
    </div>
  );
}

const Length = ({title, changeTime, type, time, formatTime}) => {
  return(
    <div className="box">
      <h3>{title}</h3>
      <div className="time-sets">
        <button onClick={() => changeTime(-60, type)}>
          <i><FaArrowDown/></i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button onClick={() => changeTime(60, type)}>
          <i><FaArrowUp/></i>
        </button>
      </div>
    </div>
  );
};

export default App;
