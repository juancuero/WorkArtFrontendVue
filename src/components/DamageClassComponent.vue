<template>
    <div class="container">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Damageclass Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" data-toggle="modal" data-target="#addNew" @click="openModalWindow">Add New <i class="fas fa-damage-plus fa-fw"></i></button>
                </div>
              </div>
             
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Descripcion</th>
                        <th>Option</th>
                  </tr> 

                  <tr v-for="damage in damages" :key="damage.id">
                    <td>{{ damage.damageclass }}</td>
                    <td>{{ damage.description }}</td>

                    <td>
                        <a href="#" data-id="damage.id" @click="editModalWindow(damage)">
                            <i class="fa fa-edit blue">Edit</i>
                        </a>
                        <a href="#" data-id="damage.id" @click="deleteDamage(damage.damageclass)">
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

                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New Damage</h5>
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Damage</h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

<form @submit.prevent="editMode ? updateDamage() : createDamage()">
<div class="modal-body">
    <div class="form-group">
        <input v-model="form.damageclass" type="text" name="damageclass"
            placeholder="Damageclass"
            class="form-control" :class="{ 'is-invalid': form.errors.has('damageclass') }">
        <has-error :form="form" field="damageclass"></has-error>
    </div>
     <div class="form-group">
        <input v-model="form.description" type="text" name="description"
            placeholder="Description"
            class="form-control" :class="{ 'is-invalid': form.errors.has('description') }">
        <has-error :form="form" field="description"></has-error>
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
                damages: {},
                form: new Form({
                    damageclass: '',
                    description : '',

                })
            }
        },
        methods: {
        
        editModalWindow(damage){
           this.form.clear();
           this.editMode = true
           this.form.reset();
           $('#addNew').modal('show');
           this.form.fill(damage)
        },
        updateDamage(){
           this.form.put('http://localhost:8080/damageclass/'+this.form.damageclass)
               .then(()=>{

                   Toast.fire({
                      icon: 'success',
                      title: 'Damage updated successfully'
                    })

                    $('#addNew').modal('hide');
                    this.loadDamages();
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

        loadDamages() {

        axios.get("http://localhost:8080/damageclasses").then( data => {this.damages = data.data; console.log(data)});
        
          //pick data from controller and push it into damages object

        },

        createDamage(){


            this.form.post('http://localhost:8080/damageclass')
                .then(() => {
                   

                        Toast.fire({
                          icon: 'success',
                          title: 'Damage created successfully'
                        })

                        $('#addNew').modal('hide');
                        this.loadDamages();

                })
                .catch(() => {
                    Toast.fire({
                          icon: 'error',
                          title: 'Damage not created'
                        })
                   console.log("Error......")
                   $('#addNew').modal('hide');
                        this.loadDamages();
                })

     

            //this.loadDamages();
          },
          deleteDamage(id) {
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
                this.form.delete('http://localhost:8080/damageclass/'+id)
                    .then((response)=> {
                            Swal.fire(
                              'Deleted!',
                              'Damage deleted successfully',
                              'success'
                            )
                    this.loadDamages();

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
            this.loadDamages();
        }
    }
</script> 