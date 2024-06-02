import React from 'react';
import styles from '../../styles/Donate.module.css';
import coin from '../../public/coin.png';

interface DonateBoxProps {
    amount: number;
    cash: number;
    bonus?: any;
    onClick: any;
}

const DonateBox: React.FC<DonateBoxProps> = ({ amount, cash, bonus , onClick }) => {
    return (
        <div className={styles.donatebox} onClick={onClick}>
            <img src={coin.src} alt="coin" width={40} />
            <div>{amount}THB</div>
            <div>{cash} CASH<br />{bonus && `(+${bonus}%)`}</div>
        </div>
    );
};

export default DonateBox;