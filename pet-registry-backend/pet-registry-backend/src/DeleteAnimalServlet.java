import java.io.IOException;
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

@WebServlet("/deleteAnimal")
public class DeleteAnimalServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/pet_registry";
    private static final String DB_USER = "user";
    private static final String DB_PASSWORD = "password";
     private static final String ERROR_RESPONSE = "{\"error\": \"true\", \"message\":\"Error deleting animal\"}";

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
          PrintWriter out = response.getWriter();
       String jsonResponse = "";
       try {
         String animalId = request.getParameter("id");
            if(animalId == null || animalId.isEmpty()){
                jsonResponse = ERROR_RESPONSE;
              } else {
                deleteAnimal(animalId);
                response.setStatus(HttpServletResponse.SC_OK);
              }
        } catch (Exception e) {
            jsonResponse = ERROR_RESPONSE;
           e.printStackTrace();
        }  finally{
         out.print(jsonResponse);
          out.flush();
       }
    }
   private void deleteAnimal(String animalId) throws SQLException {
     try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
          String query = "DELETE FROM animals WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
           preparedStatement.setString(1, animalId);
          preparedStatement.executeUpdate();
       }
    }
}