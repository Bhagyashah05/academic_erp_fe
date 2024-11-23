class Domain {
    constructor({ program, batch, capacity, qualification }) {
      this.program = program;
      this.batch = batch;
      this.capacity = parseInt(capacity, 10);
      this.qualification = qualification;
    }
  }
  
  export default Domain;
  