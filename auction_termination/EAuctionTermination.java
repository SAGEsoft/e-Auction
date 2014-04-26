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
    private static final String fromEmail = "sagesoft431w@gmail.com";
    private static final String password  = "stupidproject";

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
            System.out.println("Database connection disconnected");
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
            rs = statement.executeQuery("SELECT id,title,buyer_id,current_bid,reserve_price,createdAt,"+
                                        "UserId,auction_ended FROM items;");

            System.out.println("Scanning for auctions that have ended...");

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
                    System.out.println();
                    System.out.println("Terminating the auction for " + rs.getString("title"));

                    // update the record to show the auction ended
                    rs.updateBoolean("auction_ended", true);
                    rs.updateRow();

                    // the reserve price was met
                    if (rs.getFloat("current_bid") >= rs.getFloat("reserve_price"))
                    {
                        EmailAuctionStatus(rs, true);
                    }
                    else   // reserve price not met
                    {
                        EmailAuctionStatus(rs, false);
                    }
                }
            }

            System.out.println();
            System.out.println("Done scanning auctions");
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
     * Email the seller and the buyer whether the auction was a success and give the info of the auction
     *   and exchange info of the users if necessary
     *
     * @param auction        [in] - result of query on the items; should point to the current auction
     *                              record
     * @param auctionSuccess [in] - true when auction was a success (reserve price met)
     */
    private void EmailAuctionStatus(ResultSet auction, boolean auctionSuccess)
    {
        Statement stmtSeller  = null;                      // sql query for the auction seller
        Statement stmtBuyer   = null;                      // sql query for the auction buyer
        ResultSet rsSeller    = null;                      // result of stmtBuyer
        ResultSet rsBuyer     = null;                      // result of stmtSeller
        String    sellerEmail;                             // email of the seller
        String    buyerEmail;                              // email of the buyer

        try
        {
            // initalize the statments
            stmtSeller = con.createStatement();
            stmtBuyer  = con.createStatement();

            // query for the buyer and seller's information
            rsSeller = stmtSeller.executeQuery("SELECT name,email,phone,username " +
                                               "FROM users " +
                                               "WHERE id = " + auction.getString("UserId") + ";");
            rsBuyer  = stmtBuyer.executeQuery("SELECT name,email,phone,username " +
                                              "FROM users " +
                                              "WHERE id = " + auction.getString("buyer_id") + ";");

            // get the first and only records for each the buyer and seller
            rsSeller.next();
            rsBuyer.next();

            // get the emails for the buyer and seller
            sellerEmail = rsSeller.getString("email");
            buyerEmail  = rsBuyer.getString("email");

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
                MimeMessage msgSeller = new MimeMessage(session);
                MimeMessage msgBuyer  = new MimeMessage(session);

                // set to and from for each email
                msgSeller.setFrom(new InternetAddress(fromEmail));
                msgBuyer.setFrom(new InternetAddress(fromEmail));
                msgSeller.addRecipient(Message.RecipientType.TO, new InternetAddress(sellerEmail));
                msgBuyer.addRecipient(Message.RecipientType.TO, new InternetAddress(buyerEmail));

                if (auctionSuccess)       // auction was successful
                {
                    // set subjects
                    msgSeller.setSubject("Your auction on e-Auction has ended!");
                    msgBuyer.setSubject("You won an auction on e-Auction!");

                    // body of email to seller
                    msgSeller.setText(
                            "Greetings!\n" +
                            "\n" +
                            "Your auction for " + auction.getString("title") + " has ended. Our " +
                            "records show that the highest bid was $" +
                            String.format("%.2f", auction.getFloat("current_bid")) + " by " +
                            rsBuyer.getString("username") + ". If you wish to contact them, their " +
                            "contact information is given below:\n" +
                            "\n" +
                            rsBuyer.getString("name") + "\n" +
                            rsBuyer.getString("email") + "\n" +
                            rsBuyer.getString("phone") + "\n" +
                            "\n" +
                            "To ensure the item is paid for and delivered safely and securely, " +
                            "e-Auction acts as an intermediary. Please ship the item to e-Auction, " +
                            "where upon receiving the item, we will charge the buyer's credit card " +
                            "and ship them the item. You will receive payment as a check in the mail." +
                            "\n" +
                            "\n" +
                            "You will have two weeks to ship e-Auction the item. If the deadline is " +
                            "not met or if any other problems should arise, the exchange will become " +
                            "void. e-Auction reserves the right to withhold any items shipped to us " +
                            "if deemed necessary. Otherwise, we will return the item back to you.\n" +
                            "\n" +
                            "Visit e-Auction to create another auction or check out other " +
                            "auctions. You can also check out the trading feature to browse possible " +
                            "trades or put one of your items up for trade.\n" +
                            "\n" +
                            "Thank you for using e-Auction!\n" +
                            "\n" +
                            "The SAGEsoft team\n"
                    );

                    // body of email to buyer
                    msgBuyer.setText(
                            "Greetings!\n" +
                            "\n" +
                            "The auction for " + auction.getString("title") + " has ended. Our " +
                            "records show that you were the highest bidder at $" +
                            String.format("%.2f", auction.getFloat("current_bid")) + ". If you wish " +
                            "to contact the seller of this item, their contact information is given " +
                            "below:\n" +
                            "\n" +
                            rsSeller.getString("name") + "\n" +
                            rsSeller.getString("email") + "\n" +
                            rsSeller.getString("phone") + "\n" +
                            "\n" +
                            "To ensure the item is paid for and delivered safely and securely, " +
                            "e-Auction acts as an intermediary. The seller will ship the item to " +
                            "e-Auction, where upon receiving the item, we will charge your credit " +
                            "card and ship the item to you.\n" +
                            "\n" +
                            "The seller has two weeks to ship e-Auction the item. If the deadline is " +
                            "not met or if any other problems should arise, the exchange will become " +
                            "void.\n" +
                            "\n" +
                            "Visit e-Auction for more auctions or to create one yourself. You can " +
                            "also check out the trading feature to browse possible trades or put one " +
                            "of your items up for trade.\n" +
                            "\n" +
                            "Thank you for using e-Auction!\n" +
                            "\n" +
                            "The SAGEsoft team\n"
                    );
                }
                else                   // auction was not successful
                {
                    // set subjects
                    msgSeller.setSubject("Your auction on e-Auction has ended!");
                    msgBuyer.setSubject("An auction that you bid on has ended on e-Auction!");

                    // body of email to seller
                    msgSeller.setText(
                            "Greetings!\n" +
                            "\n" +
                            "Your auction for " + auction.getString("title") + " has ended. Our " +
                            "records show that the highest bid was $" +
                            String.format("%.2f", auction.getFloat("current_bid")) + ", which did not" +
                            " meet the reserve price of $" +
                            String.format("%.2f", auction.getFloat("reserve_price")) + ". Since the " +
                            "reserve price was not met, the auction was terminated and no exchange " +
                            "will take place.\n" +
                            "\n" +
                            "Visit e-Auction to put your item back up for auction or check out other " +
                            "auctions. You can also check out the trading feature to browse possible " +
                            "trades or put one of your items up for trade.\n" +
                            "\n" +
                            "Thank you for using e-Auction!\n" +
                            "\n" +
                            "The SAGEsoft team\n"
                    );

                    // body of email to buyer
                    msgBuyer.setText(
                            "Greetings!\n" +
                            "\n" +
                            "The auction for " + auction.getString("title") + " has ended. Our " +
                            "records show that you were the highest bidder at $" +
                            String.format("%.2f", auction.getFloat("current_bid")) + ". Unfortunately" +
                            " your bid did not meet the reserve price of the item, so the auction " +
                            "was terminated and no exchange will take place.\n" +
                            "\n" +
                            "Visit e-Auction for more auctions or to create one yourself. You can " +
                            "also check out the trading feature to browse possible trades or put one " +
                            "of your items up for trade.\n" +
                            "\n" +
                            "Thank you for using e-Auction!\n" +
                            "\n" +
                            "The SAGEsoft team\n"
                    );
                }

                // send the emails
                Transport.send(msgSeller);
                Transport.send(msgBuyer);
                System.out.println("Sent emails successfully");
            }
            catch (MessagingException me)
            {
                System.out.println("Message Exception:" + me.getMessage());
                me.printStackTrace();
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
}
