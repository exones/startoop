import { Moment, suppressDeprecationWarnings } from 'moment';
import { Dictionary } from 'typescript-collections';
import { MomentUtils } from './MomentUtils';

export class MomentDictionary<T> extends Dictionary<Moment, T> {
    constructor() {
        super(date => MomentUtils.toIsoString(date));
    }
}