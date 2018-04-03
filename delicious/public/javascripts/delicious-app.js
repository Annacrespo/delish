import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
//where webpack is bundling together
import makeMap from './modules/map';

import autocomplete from './modules/autocomplete';
autocomplete( $("#address"), $("#lat"), $("#lng") );

typeAhead($ ('.search') );

makeMap($ ('#map') );
