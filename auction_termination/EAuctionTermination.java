/**
 * @author  SAGEsoft
 * @file    EAuctionTermination.java
 * @date    April 24, 2014
 * @purpose Access the eAuction database and check which auctions are have terminated and send emails to
 *            inform the relevant participating parties
 */

import java.sql.*;

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
        db.Display();
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
            System.out.println("Connection disconnected.");
        }
    }

    /**
     * Example function for displaying elements in a database
     *
     * @note don't use this in the final program
     */
    public void Display()
    {
        Statement statement = null;
        ResultSet rs        = null;

        try
        {
            statement = con.createStatement();

            rs = statement.executeQuery("Select title,current_bid from items;");

            System.out.println("Title\t\t\t\t\tCurrent Bid");

            while (rs.next())
            {
                System.out.println(rs.getString("title") + "\t\t\t" + rs.getString("current_bid"));
            }

            System.out.println("Display completed.");
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
            statement = null;
        }
    }
}
