import { ImgHTMLAttributes } from 'react';
import logo from '../../assets/images/Flink-logo.svg';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="App Logo" {...props} />;
}
