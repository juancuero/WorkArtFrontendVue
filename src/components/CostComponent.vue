<template>
    <div class="container">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Cost Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" data-toggle="modal" data-target="#addNew" @click="openModalWindow">Add New <i class="fas fa-cost-plus fa-fw"></i></button>
                </div>
              </div>
             
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Costo</th>
                        <th>Paintingtype</th>
                        <th>Damageclass</th>
                        <th>Damagedepth</th>
                        <th>Option</th>
                  </tr> 

                  <tr v-for="cost in costs" :key="cost.id">
                    <td>{{ cost.costid }}</td>
                    <td>{{ cost.cost }}</td>
                    <td>{{ cost.paintingtype.description }}</td>
                    <td>{{ cost.damageclass.description }}</td>
                    <td>{{ cost.damagedepth.description }}</td>

                    <td>
                        <a href="#" data-id="cost.id" @click="editModalWindow(cost)">
                            <i class="fa fa-edit blue">Edit</i>
                        </a>
                        <br>
                        <a href="#" data-id="cost.id" @click="deleteCost(cost.costid)">
                            <i class="fa fa-edit blue">Delete</i>
                        </a>

                    </td>
                  </tr>
                </tbody></table>
              </div>
            
              <div class="card-footer">
                 
              </div>
            </div>
           
          </div>
        </div>


            <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">

                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New Cost</h5>
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Cost</h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

<form @submit.prevent="editMode ? updateCost() : createCost()">
<div class="modal-body">
    <div class="form-group">
        <input v-model="form.costid" type="text" name="costid"
            placeholder="costid"
            class="form-control" :class="{ 'is-invalid': form.errors.has('costid') }">
        <has-error :form="form" field="costid"></has-error>
    </div>

     <div class="form-group">
        <input v-model="form.cost" type="text" name="cost"
            placeholder="cost"
            class="form-control" :class="{ 'is-invalid': form.errors.has('cost') }">
        <has-error :form="form" field="cost"></has-error>
    </div>
    <div class="form-group">
        <h6 style="text-align: -moz-left;text-align: initial;">Paintingtype</h6>
        <select v-model="form.paintingtype" type="text" name="paintingtype"
            placeholder="paintingtype"
            class="form-control" :class="{ 'is-invalid': form.errors.has('paintingtype') }">
            <option v-for="painting in paintingtypes" :key="painting.index" :value="painting">{{painting.description}}</option>
        </select>
    </div>
    <div class="form-group">
        <h6 style="text-align: -moz-left;text-align: initial;">Damageclasses</h6>
        <select v-model="form.damageclass" type="text" name="damageclass"
            placeholder="damageclass"
            class="form-control" :class="{ 'is-invalid': form.errors.has('damageclass') }">
            <option v-for="damageclasses in damageclasseses" :key="damageclasses.index" :value="damageclasses">{{damageclasses.description}}</option>
        </select>
    </div>
    <div class="form-group">
        <h6 style="text-align: -moz-left;text-align: initial;">Damagedepth</h6>
        <select v-model="form.damagedepth" type="text" name="damagedepth"
            placeholder="damagedepth"
            class="form-control" :class="{ 'is-invalid': form.errors.has('damagedepth') }">
            <option v-for="damage in damagedepths" :key="damage.index" :value="damage">{{damage.description}}</option>
        </select>
    </div>

</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
    <button v-show="editMode" type="submit" class="btn btn-primary">Update</button>
    <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
</div>

</form>

                </div>
            </div>
            </div>
    </div>

</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
                editMode: false,
                costs: {},
                form: new Form({
                    costid: '',
                    cost : '',
                    paintingtype: {},
                    damageclass: {},
                    damagedepth: {},
                }),
                paintingtypes: {},
                damageclasseses: {},
                damagedepths: {},
            }
        },
        methods: {
        
        editModalWindow(cost){
           this.form.clear();
           this.editMode = true
           this.form.reset();
           $('#addNew').modal('show');
           this.form.fill(cost)
        },
        updateCost(){
           this.form.put('http://localhost:8080/cost/'+this.form.costid)
               .then(()=>{

                   Toast.fire({
                      icon: 'success',
                      title: 'Cost updated successfully'
                    })

                    $('#addNew').modal('hide');
                    this.loadCosts();
               })
               .catch(()=>{
                  console.log("Error.....")
               })
        },
        openModalWindow(){
           this.editMode = false
           this.form.reset();
           $('#addNew').modal('show');
        },

        loadPainting() {

        axios.get("http://localhost:8080/paintings").then( data => {this.paintingtypes = data.data; console.log(data)});
        
          //pick data from controller and push it into costs object

        },
        loadDamageDepth() {

        axios.get("http://localhost:8080/damagedepths").then( data => {this.damagedepths = data.data; console.log(data)});
        
          //pick data from controller and push it into costs object

        },
        loadDamageClass() {

        axios.get("http://localhost:8080/damageclasses").then( data => {this.damageclasseses = data.data; console.log(data)});
        
          //pick data from controller and push it into costs object

        },
        loadCosts() {

        axios.get("http://localhost:8080/costs").then( data => {this.costs = data.data; console.log(data)});
        
          //pick data from controller and push it into costs object

        },

        createCost(){


            this.form.post('http://localhost:8080/cost')
                .then(() => {
                   

                        Toast.fire({
                          icon: 'success',
                          title: 'Cost created successfully'
                        })

                        $('#addNew').modal('hide');
                        this.loadCosts();

                })
                .catch(() => {
                    Toast.fire({
                          icon: 'error',
                          title: 'Cost not created'
                        })
                   console.log("Error......");
                   $('#addNew').modal('hide');
                        this.loadCosts();
                })

     

            //this.loadCosts();
          },
          deleteCost(id) {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                
              if (result.value) {
                //Send Request to server
                this.form.delete('http://localhost:8080/cost/'+id)
                    .then((response)=> {
                            Swal.fire(
                              'Deleted!',
                              'Cost deleted successfully',
                              'success'
                            )
                    this.loadCosts();

                    }).catch(() => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                          footer: '<a href>Why do I have this issue?</a>'
                        })
                    })
                }

            })
          }
        },

        created() { 
            axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');
            
            this.loadCosts();
            this.loadPainting();
            this.loadDamageDepth();
            this.loadDamageClass();
        }
    }
</script> 