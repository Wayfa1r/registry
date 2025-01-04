import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/addAnimal")
public class AddAnimalServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/pet_registry";
    private static final String DB_USER = "user";
    private static final String DB_PASSWORD = "password";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

      // Get all the params from the request
      BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuilder jsonBody = new StringBuilder();
        String line;
       while ((line = reader.readLine()) != null){
          jsonBody.append(line);
        }
        String jsonString = jsonBody.toString();
        ObjectMapper mapper = new ObjectMapper();
        Animal newAnimal = mapper.readValue(jsonString, Animal.class);
       // Write the data into the database
       try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
          String query = "INSERT INTO animals " +
                  "(id,id_number, name, scientific_name, species, breed, dob, gender, description, vaccinations, allergies, medications, notes, spayed_neutered, photo) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
           PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, newAnimal.getId());
             preparedStatement.setString(2, newAnimal.getIdNumber());
           preparedStatement.setString(3, newAnimal.getName());
           preparedStatement.setString(4, newAnimal.getScientificName());
           preparedStatement.setString(5, newAnimal.getSpecies());
           preparedStatement.setString(6, newAnimal.getBreed());
           preparedStatement.setString(7, newAnimal.getDob());
           preparedStatement.setString(8, newAnimal.getGender());
           preparedStatement.setString(9, newAnimal.getDescription());
           preparedStatement.setString(10, newAnimal.getVaccinations());
           preparedStatement.setString(11, newAnimal.getAllergies());
            preparedStatement.setString(12, newAnimal.getMedications());
            preparedStatement.setString(13, newAnimal.getNotes());
             preparedStatement.setBoolean(14, newAnimal.getSpayedNeutered());
            preparedStatement.setString(15, newAnimal.getPhoto());
          preparedStatement.executeUpdate();
             // Send success back to the user
            response.setStatus(HttpServletResponse.SC_OK);

       } catch (SQLException e) {
           e.printStackTrace();
          // Send error back to the user
             response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

    }
   // Helper class for mapping request body to animal
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
    }
}