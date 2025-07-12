import { ImgHTMLAttributes } from 'react';
import logo from '../../assets/images/Flink-logo-white.svg';

export default function AppLogoIconWhite(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="App Logo" {...props} />;
}
