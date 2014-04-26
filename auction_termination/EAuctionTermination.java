/**
 * @author  SAGEsoft
 * @file    EAuctionTermination.java
 * @date    April 24, 2014
 * @purpose Access the eAuction database and check which auctions are have terminated and send emails to
 *            inform the relevant participating parties
 */

import java.sql.*;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class EAuctionTermination
{
    private Connection con;               /**< connection object to the database */

    /**
     * @param args [in] - the command line arguments
     */
    public static void main(String[] args)
    {
        EAuctionTermination db = new EAuctionTermination();
        db.Connect("sagesoft", "root", "");
        db.CheckTerminatedAuctions();
        db.Disconnect();
    }

    /**
     * The constructor
     */
    public EAuctionTermination()
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

            System.out.println("Connection established");
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
            System.out.println("Connection disconnected");
        }
    }

    /**
     * Scans the database for auction items that have terminated their auction, and send out emails
     *   to the relevant users
     */
    public void CheckTerminatedAuctions()
    {
        Statement statement  = null;                      // sql query
        ResultSet rs         = null;                      // result of the query
        Calendar  cal        = Calendar.getInstance();    // calendar for determining if auction ended
        Date      todaysDate = new Date();                // today's date

        try
        {
            // initalize statement so it will allow scrolling and udpating records
            statement = con.createStatement();
            statement = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
                                                  ResultSet.CONCUR_UPDATABLE);

            // query for all necessary columns of the items
            rs = statement.executeQuery("SELECT title,buyer_id,current_bid,reserve_price,createdAt," +
                                        "UserId FROM items;");

            // scan through all records of the items and check for auctions that ended
            while (rs.next())
            {
                // if auction was already ended, continue to next record
                if (rs.getBoolean("auction_ended"))
                    continue;

                // calculate date that auction should end (2 weeks after created date)
                cal.setTime(rs.getDate("createdAt"));
                cal.add(Calendar.DATE, 14);

                // today's date is after the auction end date
                if ( todaysDate.after(cal.getTime()) )
                {
                    // update the record to show the auction ended
                    rs.updateBoolean("auction_ended", true);
                    rs.updateRow();

                    // the reserve price was met
                    if (rs.getFloat("current_bid") >= rs.getFloat("reserve_price"))
                    {
                        EmailAuctionSuccess(rs);
                    }
                    else   // reserve price not met
                    {
                        EmailAuctionFailed(rs);
                    }
                }
            }
        }
        catch (SQLException sqle)
        {
            System.out.println("SQL Exception:" + sqle.getMessage());
            sqle.printStackTrace();
        }
        catch (Exception e)
        {
            System.out.println("General Exception:" + e.getMessage());
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
     * Email the seller and the buyer that the auction was a success and give the info of the auction
     *   and exchange info of the users
     *
     * @param auction [in] - result of query on the items; should point to the current auction record
     */
    public void EmailAuctionSuccess(ResultSet auction)
    {
        Statement stmtSeller = null;                      // sql query for the auction seller
        Statement stmtBuyer  = null;                      // sql query for the auction buyer
        ResultSet rsSeller   = null;                      // result of stmtBuyer
        ResultSet rsBuyer    = null;                      // result of stmtSeller

        try
        {
            // initalize the statments
            stmtSeller = con.createStatement();
            stmtBuyer  = con.createStatement();

            // query for the buyer and seller's information
            rsSeller = stmtSeller.executeQuery("SELECT name,email,phone,username " +
                                               "FROM users " +
                                               "WHERE id == " + auction.getString("UserId") + ";");
            rsBuyer  = stmtBuyer.executeQuery("SELECT name,email,phone,username " +
                                              "FROM users " +
                                              "WHERE id == " + auction.getString("buyer_id") + ";");

            // get the first and only records for each the buyer and seller
            rsSeller.next();
            rsBuyer.next();

            // email the users
            // Recipient's email ID needs to be mentioned.
            String to   = "abcd@gmail.com";
            String from = "web@gmail.com";
            String host = "localhost";

            // Get system properties, Setup mail server, and Get the default Session object.
            Properties properties = System.getProperties();
            properties.setProperty("mail.smtp.host", host);
            Session session = Session.getDefaultInstance(properties);

            try
            {
                // Create a default MimeMessage object.
                MimeMessage message = new MimeMessage(session);

                // Set to and from
                message.setFrom(new InternetAddress(from));
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

                // Set Subject: header field
                message.setSubject("This is the Subject Line!");

                // Now set the actual message
                message.setText("This is actual message");

                // Send message
                Transport.send(message);
                System.out.println("Sent message successfully....");
            }
            catch (MessagingException mex)
            {
                mex.printStackTrace();
            }
        }
        catch (SQLException sqle)
        {
            System.out.println("SQL Exception:" + sqle.getMessage());
            sqle.printStackTrace();
        }
        catch (Exception e)
        {
            System.out.println("General Exception:" + e.getMessage());
        }
        finally
        {
            if(stmtSeller != null)
            {
                try
                {
                    stmtSeller.close();
                }
                catch (SQLException sqle)
                {
                    System.out.println("SQL Exception:" + sqle.getMessage());
                    sqle.printStackTrace();
                }
            }

            if(stmtBuyer != null)
            {
                try
                {
                    stmtBuyer.close();
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
     * Email the seller that the auction failed and give the info of the auction and the info of the
     *   highest bidder
     *
     * @param auction [in] - result of query on the items; should point to the current auction record
     */
    public void EmailAuctionFailed(ResultSet auction)
    {

    }
}
