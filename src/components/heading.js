import { Row } from './ui/row';
import avaxLogo from '../images/avax.png';

export const Heading = () => {
  return (
    <Row className={'text-center'}>
      <img style={{width: 80, height: 80}} className={'mt-2 mb-2'} src={avaxLogo} alt={'AVAX logo'} />
      <p>Welcome to our AVAX validator application!</p>
    </Row>
  );
};
