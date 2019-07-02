import "../sass/main.scss";

class Person {
    constructor(fName, lName) {
        this.fName = fName;
        this.lName = lName;
    }
    sayHello() {
        console.log(`My name is ${this.fName} ${this.lName}`);
    }
}

const person1 = new Person("Bartosz", "Pulajew");
person1.sayHello();

const person2 = new Person("Anna", "Nowak");
person2.sayHello();