export default class Command {
    constructor(execute, undo, redo){
        this.execute = execute;
        this.undo = undo;
        this.redo = redo;
    }
}