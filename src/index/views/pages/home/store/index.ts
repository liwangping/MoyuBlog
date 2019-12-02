import { observable,  action } from "mobx";


export default class HomeStore {
    @observable title: string = "Home";
    // @observable isSpinning: boolean = false;
}