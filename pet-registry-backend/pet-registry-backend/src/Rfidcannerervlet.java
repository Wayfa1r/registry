import com.fasterxml.jackson.databind.ObjectMapper;
import com.fazecast.jSerialComm.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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

@WebServlet("/scanRfid")
public class RfidScannerServlet extends HttpServlet {
    // Replace with your actual serial port
    private static final String SERIAL_PORT_NAME = "COM3"; // Replace with your scanner's port
    private static final String DB_URL = "jdbc:mysql://localhost:3306/pet_registry"; // Replace with your database url
    private static final String DB_USER = "user"; // Replace with your database username
    private static final String DB_PASSWORD = "password"; // Replace with your database password
    private static final String ERROR_RESPONSE = "{\"error\": \"true\", \"message\":\"Error reading from scanner or database\"}";
    private static final String ANIMAL_NOT_FOUND_RESPONSE = "{\"error\": \"true\", \"message\":\"Animal not found.\"}";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
      ObjectMapper mapper = new ObjectMapper();
      String jsonResponse = "";
        try {
            String rfid = readRfidFromScanner(); // Get the RFID from the scanner
           if (rfid == null || rfid.isEmpty()){
                jsonResponse = ERROR_RESPONSE;
            }else {
               String animalId = getAnimalId(rfid); // Get animal ID from database
               if (animalId != null) {
                  jsonResponse = "{\"error\": \"false\", \"animalId\":\"" + animalId + "\"}";
              } else{
                 jsonResponse = ANIMAL_NOT_FOUND_RESPONSE;
              }
            }
        } catch(Exception e){
         jsonResponse = ERROR_RESPONSE;
         e.printStackTrace();
        } finally{
           out.print(jsonResponse);
          out.flush();
        }
    }
    private String readRfidFromScanner(){
       String rfid = null;
         SerialPort comPort = null;
        try{
         comPort = SerialPort.getCommPort(SERIAL_PORT_NAME);
           comPort.setComPortParameters(9600, 8, 1, 0);
            comPort.openPort();
            comPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 1000);
            BufferedReader reader = new BufferedReader(new InputStreamReader(comPort.getInputStream()));
            rfid = reader.readLine();
            reader.close();
        } catch (Exception e){
           e.printStackTrace();
            return null;
       } finally{
         if(comPort != null)
             comPort.closePort();
       }

         return rfid;
    }
    private String getAnimalId(String rfid) throws SQLException {
       String animalId = null;
       try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
          String query = "SELECT id FROM animals WHERE rfid = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, rfid);
            ResultSet resultSet = preparedStatement.executeQuery();

           if (resultSet.next()){
              animalId = resultSet.getString("id");
           }

        }
        return animalId;
    }
}