import '../sass/style.scss';

import { $, $$ } from './modules/bling';

//where webpack is bundling together

import autocomplete from './modules/autocomplete';
autocomplete( $("#address"), $("#lat"), $("#lng") );
