import React, {useRef} from 'react';

import {useSelector} from 'react-redux';

import {id as pluginId} from 'src/manifest';

import {isWikiRHSOpen} from '../../selectors';

import ReactLogoWhite from './wiki-logo.png';

//import ReactLogoDark from './wiki-dark.png';

export default function MenuIcon() {
    const myRef = useRef<HTMLImageElement>(null);
    const isRHSOpen = useSelector(isWikiRHSOpen);

    console.log(isRHSOpen);

    // If it has been mounted, we know our parent is always a button.
    const parent = myRef?.current ? myRef?.current?.parentNode as HTMLButtonElement : null;
    if (parent) {
        if (isRHSOpen) {
            parent.classList.add('channel-header__icon--active');
        } else {
            parent.classList.remove('channel-header__icon--active');
        }
    }

    return (
        <img
            src={`/static/plugins/${pluginId}/${isRHSOpen ? ReactLogoWhite : ReactLogoWhite}`}
            ref={myRef}
            alt='Home'
            height='23px'
            width='23px'
        />
    );
}
