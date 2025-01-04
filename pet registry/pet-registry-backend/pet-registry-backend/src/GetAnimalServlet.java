import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/getAnimal")
public class GetAnimalServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/pet_registry"; // Replace with your database url
    private static final String DB_USER = "user"; // Replace with your database username
    private static final String DB_PASSWORD = "password"; // Replace with your database password
    private static final String ERROR_RESPONSE = "{\"error\": \"true\", \"message\":\"Error accessing database\"}";
    private static final String ANIMAL_NOT_FOUND_RESPONSE = "{\"error\": \"true\", \"message\":\"Animal not found.\"}";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = "";
        String animalId = request.getParameter("id");

        try {
           if(animalId == null || animalId.isEmpty()){
                 jsonResponse =  ERROR_RESPONSE;
             } else{
                  String animalJson = getAnimalProfile(animalId);
                 if (animalJson != null) {
                     jsonResponse = animalJson;
                 } else {
                     jsonResponse = ANIMAL_NOT_FOUND_RESPONSE;
                   }
              }
        } catch (Exception e) {
            jsonResponse =  ERROR_RESPONSE;
            e.printStackTrace();
        } finally{
            out.print(jsonResponse);
            out.flush();
         }
    }
    private String getAnimalProfile(String animalId) throws SQLException, IOException {
       String animalJson = null;
       try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "SELECT * FROM animals WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, animalId);
            ResultSet resultSet = preparedStatement.executeQuery();

           if (resultSet.next()){
              ObjectMapper mapper = new ObjectMapper();
               animalJson =  mapper.writeValueAsString(mapResultSetToAnimal(resultSet));
           }
        }
       return animalJson;
    }
    private Animal mapResultSetToAnimal(ResultSet resultSet) throws SQLException {
           Animal animal = new Animal();
         animal.setId(resultSet.getString("id"));
          animal.setIdNumber(resultSet.getString("id_number"));
           animal.setName(resultSet.getString("name"));
          animal.setScientificName(resultSet.getString("scientific_name"));
          animal.setSpecies(resultSet.getString("species"));
           animal.setBreed(resultSet.getString("breed"));
          animal.setDob(resultSet.getDate("dob").toString());
           animal.setGender(resultSet.getString("gender"));
          animal.setDescription(resultSet.getString("description"));
          animal.setVaccinations(resultSet.getString("vaccinations"));
           animal.setAllergies(resultSet.getString("allergies"));
          animal.setMedications(resultSet.getString("medications"));
          animal.setNotes(resultSet.getString("notes"));
          animal.setSpayedNeutered(resultSet.getBoolean("spayed_neutered"));
            animal.setPhoto(resultSet.getString("photo"));
            animal.setRfid(resultSet.getString("rfid"));
            return animal;
    }
     // Helper class for converting database rows
    private static class Animal {
        private String id;
         private String idNumber;
        private String name;
        private String scientificName;
        private String species;
        private String breed;
        private String dob;
        private String gender;
        private String description;
        private String vaccinations;
        private String allergies;
        private String medications;
        private String notes;
        private Boolean spayedNeutered;
        private String photo;
         private String rfid;
        // Getters and setters
        public String getId(){
          return id;
         }
         public void setId(String id){
            this.id = id;
         }
           public String getIdNumber(){
            return idNumber;
         }
         public void setIdNumber(String idNumber){
            this.idNumber = idNumber;
         }
          public String getName(){
            return name;
         }
        public void setName(String name){
           this.name = name;
         }
        public String getScientificName(){
           return scientificName;
       }
      public void setScientificName(String scientificName){
           this.scientificName = scientificName;
       }
        public String getSpecies(){
          return species;
       }
      public void setSpecies(String species){
           this.species = species;
       }
       public String getBreed(){
          return breed;
       }
      public void setBreed(String breed){
           this.breed = breed;
       }
         public String getDob(){
          return dob;
       }
      public void setDob(String dob){
           this.dob = dob;
       }
        public String getGender(){
          return gender;
       }
        public void setGender(String gender){
           this.gender = gender;
       }
       public String getDescription(){
          return description;
       }
      public void setDescription(String description){
           this.description = description;
       }
        public String getVaccinations(){
           return vaccinations;
        }
       public void setVaccinations(String vaccinations){
            this.vaccinations = vaccinations;
        }
        public String getAllergies(){
           return allergies;
        }
       public void setAllergies(String allergies){
            this.allergies = allergies;
        }
        public String getMedications(){
         return medications;
       }
      public void setMedications(String medications){
           this.medications = medications;
       }
        public String getNotes(){
         return notes;
       }
        public void setNotes(String notes){
           this.notes = notes;
       }
        public Boolean getSpayedNeutered(){
          return spayedNeutered;
       }
        public void setSpayedNeutered(Boolean spayedNeutered){
            this.spayedNeutered = spayedNeutered;
        }
        public String getPhoto(){
           return photo;
        }
        public void setPhoto(String photo){
            this.photo = photo;
        }
          public String getRfid(){
           return rfid;
         }
        public void setRfid(String rfid){
             this.rfid = rfid;
         }
    }
}