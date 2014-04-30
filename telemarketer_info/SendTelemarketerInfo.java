/**
 * @author  SAGEsoft
 * @file    SendTelemarketerInfo.java
 * @date    April 29, 2014
 * @purpose Access the eAuction database and send the info of registered users to telemarketers
 */

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.*;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import javax.activation.*;
import javax.mail.*;
import javax.mail.internet.*;

public class SendTelemarketerInfo
{
    private static final String toEmail   = "eauctiontelemarketer@gmail.com";
    private static final String fromEmail = "sagesoft431w@gmail.com";
    private static final String password  = "stupidproject";
    private static final String infoFile  = "UserInfo.txt";

    private Connection con;               /**< connection object to the database */

    /**
     * @param args [in] - the command line arguments
     */
    public static void main(String[] args)
    {
        SendTelemarketerInfo db = new SendTelemarketerInfo();
        db.Connect("sagesoft", "root", "");
        db.WriteInfoToFile();
        db.SendEmail();
        db.Disconnect();
    }

    /**
     * The constructor
     */
    public SendTelemarketerInfo()
    {
        con = null;
    }

    /**
     * Connect to the database dbname with username userid and password passwd
     *
     * @param dbname [in] - name of the database to connect to
     * @param userid [in] - username for connecting to the database
     * @param passwd [in] - password for connecting to the database
     */
    public void Connect(String dbname, String userid, String passwd)
    {
        try
        {
            Class.forName("com.mysql.jdbc.Driver");

            if (con != null)
            {
                con.close();
                con = null;
            }

            con = DriverManager.getConnection("jdbc:mysql://localhost/" + dbname, userid, passwd);

            System.out.println("Database connection established");
            System.out.println();
        }
        catch (SQLException sqle)
        {
            System.out.println("SQL Exception:" + sqle.getMessage());
            con = null;
        }
        catch (ClassNotFoundException cnfe)
        {
            System.out.println("Class Exception:" + cnfe.getMessage());
            con = null;
        }
        catch (Exception e)
        {
            System.out.println("General Exception:" + e.getMessage());
            con = null;
        }
    }

    /**
     * Disconnect from the database
     */
    public void Disconnect()
    {
        try
        {
            if (con != null)
            {
                con.close();
            }
        }
        catch (SQLException sqle)
        {
            System.out.println("SQL Exception:" + sqle.getMessage());
        }
        finally
        {
            con = null;
            System.out.println();
            System.out.println("Database connection disconnected");
        }
    }

    /**
     * Scans the database for all users and writes their info to a text file
     */
    public void WriteInfoToFile()
    {
        PrintWriter writer;                                // writer for the info file
        Statement   statement  = null;                     // sql query
        ResultSet   rs         = null;                     // result of the query
        Calendar    cal        = Calendar.getInstance();   // calendar for determining age of user
        Date        todaysDate = new Date();               // today's date

        try
        {
            // open the file
            writer = new PrintWriter(infoFile, "UTF-8");

            // initalize statement
            statement = con.createStatement();

            // query for all necessary columns of users
            rs = statement.executeQuery("SELECT users.name, users.email, users.phone, " +
                                            "users.birth_date, users.gender, users.income, " +
                                            "addresses.street, addresses.city, addresses.state, " +
                                            "addresses.zip " +
                                        "FROM users,addresses " +
                                        "WHERE users.id = addresses.UserId;");

            System.out.println("Writing user info to \"UserInfo.txt\"...");

            writer.println("Name, Email, Phone, Street, City, State, ZIP, Gender, Age, Income");

            // scan through all records of the users and write their info to the file
            while (rs.next())
            {
                int age = 0;               // calculated age of user based on birth date

                // calculate age based on day of birth
                if (rs.getDate("birth_date") != null)
                {
                    cal.setTime(rs.getDate("birth_date"));
                    cal.add(Calendar.YEAR, 1);

                    // increment birth date year by one until you are passed today's date; add one to
                    //   calculated age for every iteration
                    while ( todaysDate.after(cal.getTime()) )
                    {
                        age += 1;
                        cal.add(Calendar.YEAR, 1);
                    }
                }

                writer.println(rs.getString("name") + ", " + rs.getString("email") + ", " +
                               rs.getString("phone") + ", " + rs.getString("street") + ", " +
                               rs.getString("city") + ", " + rs.getString("state") + ", " +
                               rs.getString("zip") + ", " + rs.getString("gender") + ", " +
                               age + ", " + rs.getString("income"));
            }

            System.out.println("Done scanning auctions");
            System.out.println();

            writer.close();
        }
        catch (SQLException sqle)
        {
            System.out.println("SQL Exception:" + sqle.getMessage());
            sqle.printStackTrace();
        }
        catch (FileNotFoundException fnfe)
        {
            System.out.println("File Not Found Exception:" + fnfe.getMessage());
        }
        catch (UnsupportedEncodingException uee)
        {
            System.out.println("Unsupported Encoding Exception:" + uee.getMessage());
        }
        catch (Exception e)
        {
            System.out.println("General Exception:" + e.getMessage());
            e.printStackTrace();
        }
        finally
        {
            if(statement != null)
            {
                try
                {
                    statement.close();
                }
                catch (SQLException sqle)
                {
                    System.out.println("SQL Exception:" + sqle.getMessage());
                    sqle.printStackTrace();
                }
            }
        }
    }

    /**
     * Email the telemarketer the created text file containing all the user info
     */
    private void SendEmail()
    {
        // setup connection to gmail in order to send emails
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
            new javax.mail.Authenticator()
            {
                protected PasswordAuthentication getPasswordAuthentication()
                {
                    return new PasswordAuthentication(fromEmail, password);
                }
            });

        try
        {
            MimeMessage message = new MimeMessage(session);

            // set to and from
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));

            // set subject
            message.setSubject("e-Auction Registered User Info");

            // create text part of the body of message
            BodyPart msgBodyPart = new MimeBodyPart();
            msgBodyPart.setText(
                    "Greetings!\n" +
                    "\n" +
                    "Attached are the demographics of all our registered users.\n" +
                    "\n" +
                    "We thank you for your partnership!\n" +
                    "\n" +
                    "The SAGEsoft team\n"
            );

            // add the text to the body
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(msgBodyPart);

            // create the attachment part using infoFile and add it to the body
            DataSource source = new FileDataSource(infoFile);
            msgBodyPart       = new MimeBodyPart();
            msgBodyPart.setDataHandler(new DataHandler(source));
            msgBodyPart.setFileName(infoFile);
            multipart.addBodyPart(msgBodyPart);

            // add the body to the message
            message.setContent(multipart);

            // send the email
            Transport.send(message);
            System.out.println("Sent email successfully");
        }
        catch (MessagingException me)
        {
            System.out.println("Message Exception:" + me.getMessage());
            me.printStackTrace();
        }
    }
}
