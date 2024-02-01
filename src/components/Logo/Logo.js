import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt className='br2 shadow-2' style={{height: 150, width: 150}}>
        <div className='pa3'>
          <img src={brain} alt="logo" style={{paddingTop: '5px', width: 100}} />
        </div>
      </Tilt>
    </div>
  )
};

export { Logo };
