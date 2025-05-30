USE [master]
GO
/****** Object:  Database [FPL_Mapogo_03]    Script Date: 1/27/2025 6:51:04 PM ******/
CREATE DATABASE [FPL_Mapogo_03]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FPL_Mapogo_03', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\FPL_Mapogo_03.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FPL_Mapogo_03_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\FPL_Mapogo_03_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [FPL_Mapogo_03] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FPL_Mapogo_03].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FPL_Mapogo_03] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ARITHABORT OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FPL_Mapogo_03] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FPL_Mapogo_03] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FPL_Mapogo_03] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FPL_Mapogo_03] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [FPL_Mapogo_03] SET  MULTI_USER 
GO
ALTER DATABASE [FPL_Mapogo_03] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FPL_Mapogo_03] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FPL_Mapogo_03] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FPL_Mapogo_03] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FPL_Mapogo_03] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [FPL_Mapogo_03] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [FPL_Mapogo_03] SET QUERY_STORE = ON
GO
ALTER DATABASE [FPL_Mapogo_03] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [FPL_Mapogo_03]
GO
/****** Object:  User [FPL_Mapogo]    Script Date: 1/27/2025 6:51:05 PM ******/
CREATE USER [FPL_Mapogo] FOR LOGIN [FPL_Mapogo] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [FPL_Mapogo]
GO
/****** Object:  Table [dbo].[AccountPackageBenefit]    Script Date: 1/27/2025 6:51:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountPackageBenefit](
	[Account_Package_Benefit_Id] [int] IDENTITY(1,1) NOT NULL,
	[Benefit_Id] [int] NOT NULL,
	[Account_Package_Id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Account_Package_Benefit_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountPackages]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountPackages](
	[Account_Package_Id] [int] IDENTITY(1,1) NOT NULL,
	[Package_Name] [nvarchar](100) NOT NULL,
	[Price] [float] NOT NULL,
	[Duration_Days] [int] NOT NULL,
	[Limit_SportFields] [int] NOT NULL,
	[Limit_Bookings] [int] NOT NULL,
	[status] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Account_Package_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Address]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Address](
	[Address_Id] [int] IDENTITY(1,1) NOT NULL,
	[Province] [nvarchar](100) NOT NULL,
	[District] [nvarchar](100) NOT NULL,
	[Ward] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Address_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AddressUser]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AddressUser](
	[Address_User_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Address_Id] [int] NOT NULL,
	[Address_Detail] [nvarchar](100) NOT NULL,
	[Active] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Address_User_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Authorities]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Authorities](
	[Authority_Id] [int] IDENTITY(1,1) NOT NULL,
	[Authority] [int] NOT NULL,
	[Username] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Authority_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Benefits]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Benefits](
	[Benefit_Id] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Benefit_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BlogImages]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BlogImages](
	[Blog_Image_Id] [int] IDENTITY(1,1) NOT NULL,
	[Blog_Post_Id] [int] NOT NULL,
	[Image] [varchar](100) NOT NULL,
	[Description] [nvarchar](100) NULL,
	[Created_At] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Blog_Image_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BlogPosts]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BlogPosts](
	[Blog_Post_Id] [int] IDENTITY(1,1) NOT NULL,
	[Owner_Id] [int] NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Content] [nvarchar](max) NULL,
	[Created_At] [datetime] NOT NULL,
	[Update_At] [datetime] NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Views] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Blog_Post_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BookingDetails]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingDetails](
	[Booking_Detail_Id] [int] IDENTITY(1,1) NOT NULL,
	[Start_Time] [varchar](20) NOT NULL,
	[End_Time] [varchar](20) NOT NULL,
	[Sport_Field_Detail_Id] [int] NOT NULL,
	[Price] [float] NOT NULL,
	[Booking_Id] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[Subscription_Key] [nvarchar](max) NULL,
	[Status] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Booking_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BookingPayments]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingPayments](
	[Booking_Payment_Id] [int] IDENTITY(1,1) NOT NULL,
	[Booking_Id] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Reference_Code] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Booking_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bookings]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bookings](
	[Booking_Id] [int] IDENTITY(1,1) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Total_Amount] [float] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Payment_Method_Id] [int] NOT NULL,
	[Owner_Id] [int] NOT NULL,
	[Voucher_Id] [int] NULL,
	[Note] [nvarchar](max) NULL,
	[Full_Name] [nvarchar](150) NULL,
	[Phone_Number] [nvarchar](10) NULL,
	[Percent_Deposit] [int] NULL,
	[Old_Total_Amount] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Booking_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Carts]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Carts](
	[Cart_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Product_Detail_Size_Id] [int] NOT NULL,
	[Date] [datetime] NOT NULL,
	[Total_Amount ] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Cart_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoriesField]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoriesField](
	[Categories_Field_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Image] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Categories_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoriesProduct]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoriesProduct](
	[Category_Product_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Image] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Category_Product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FavoriteFields]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FavoriteFields](
	[Favorite_Field_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Sport_Field_Id] [int] NOT NULL,
	[Added_Date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Favorite_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FieldReviews]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FieldReviews](
	[Field_Review_Id] [int] IDENTITY(1,1) NOT NULL,
	[Sport_Field_Id] [int] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Rating] [int] NOT NULL,
	[Comment] [nvarchar](max) NULL,
	[Dated_At] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Field_Review_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gallery]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gallery](
	[Gallery_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Product_Detail_Id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Gallery_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GallerySportField]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GallerySportField](
	[Gallery_Sport_Field_Id] [int] IDENTITY(1,1) NOT NULL,
	[Sport_Field_Id] [int] NOT NULL,
	[Image] [varchar](200) NOT NULL,
 CONSTRAINT [PK_GallerySportField] PRIMARY KEY CLUSTERED 
(
	[Gallery_Sport_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[MessageId] [int] IDENTITY(1,1) NOT NULL,
	[SenderUsername] [varchar](100) NOT NULL,
	[ReceiverUsername] [varchar](100) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[MessageId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[Notification_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[Type] [varchar](50) NULL,
	[Is_Read] [bit] NULL,
	[Created_At] [datetime] NULL,
	[Updated_At] [datetime] NULL,
	[Booking_Id] [int] NULL,
	[Order_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Notification_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[Order_Detail_Id] [int] IDENTITY(1,1) NOT NULL,
	[Product_Detail_Size_Id] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Order_Id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Order_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderPayments]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderPayments](
	[Order_Payment_Id] [int] IDENTITY(1,1) NOT NULL,
	[Order_Id] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Reference_Code] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Order_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Order_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Address] [nvarchar](255) NOT NULL,
	[Phone_Number] [varchar](100) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Amount] [float] NOT NULL,
	[Payment_Method_Id] [int] NOT NULL,
	[Voucher_Id] [int] NULL,
	[Note] [nvarchar](max) NULL,
	[Ship_Fee] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Order_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Owners]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Owners](
	[Owner_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Bank_Account] [varchar](100) NULL,
	[Momo_Account] [varchar](100) NULL,
	[Vnpay_Account] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Owner_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentMethods]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentMethods](
	[Payment_Method_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Payment_Method_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhoneNumbers]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhoneNumbers](
	[Phone_Number_Id] [int] IDENTITY(1,1) NOT NULL,
	[Phone_Number] [nchar](10) NOT NULL,
 CONSTRAINT [PK_PhoneNumber] PRIMARY KEY CLUSTERED 
(
	[Phone_Number_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhoneNumberUser]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhoneNumberUser](
	[Phone_Number_User_Id] [int] IDENTITY(1,1) NOT NULL,
	[Phone_Number_Id] [int] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_PhoneNumberUser] PRIMARY KEY CLUSTERED 
(
	[Phone_Number_User_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductDetails]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductDetails](
	[Product_Detail_Id] [int] IDENTITY(1,1) NOT NULL,
	[Product_Id] [int] NOT NULL,
	[Color] [nvarchar](100) NOT NULL,
	[Image] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Product_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductDetailSize]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductDetailSize](
	[Product_Detail_Size_Id] [int] IDENTITY(1,1) NOT NULL,
	[Product_Detail_Id] [int] NOT NULL,
	[Size_Id] [int] NOT NULL,
	[Price] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Product_Detail_Size_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Productreviews]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Productreviews](
	[Product_Review_Id] [int] IDENTITY(1,1) NOT NULL,
	[Product_Id] [int] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Rating] [int] NOT NULL,
	[Comment] [nvarchar](max) NULL,
	[Dated_At] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Product_Review_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Product_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Category_Product_Id] [int] NOT NULL,
	[Decription] [nvarchar](max) NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Created_Date] [datetime] NOT NULL,
	[Brand] [nvarchar](100) NOT NULL,
	[Country] [nvarchar](100) NOT NULL,
	[Image] [varchar](100) NOT NULL,
	[Price] [float] NOT NULL,
	[Stock] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Role_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Role_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sizes]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sizes](
	[Size_Id] [int] IDENTITY(1,1) NOT NULL,
	[Size_Name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Size_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SportFieldDetails]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SportFieldDetails](
	[Sport_Fiel_Detail_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Price] [float] NOT NULL,
	[Peak_Hour_Prices] [float] NOT NULL,
	[Size] [nvarchar](100) NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Sport_Filed_Id] [int] NOT NULL,
	[Peak_Hour] [varchar](100) NOT NULL,
	[Percent_Deposit] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Sport_Fiel_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SportFields]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SportFields](
	[Sport_Field_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Address] [nvarchar](200) NOT NULL,
	[Opening] [varchar](100) NOT NULL,
	[Closing] [varchar](100) NOT NULL,
	[Categories_Field_Id] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Image] [varchar](100) NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Owner_Id] [int] NOT NULL,
	[Decription] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Sport_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StatusSportFieldDetails]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StatusSportFieldDetails](
	[Status_Sport_Field_Detail_Id] [int] IDENTITY(1,1) NOT NULL,
	[Sport_Fiel_Detail_Id] [int] NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NULL,
	[StatusName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Status_Sport_Field_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubscriptionPayments]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubscriptionPayments](
	[Subscription_Payment_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[User_Subscription_Id] [int] NOT NULL,
	[Payment_Method_Id] [int] NOT NULL,
	[Amount] [float] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Payment_Date] [datetime] NOT NULL,
	[Reference_Code] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Subscription_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transactions]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transactions](
	[Transaction_Id] [int] IDENTITY(1,1) NOT NULL,
	[Wallet_Id] [int] NULL,
	[Amount] [decimal](10, 2) NOT NULL,
	[Transaction_Type] [varchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[Created_At] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Transaction_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Username] [varchar](100) NOT NULL,
	[Fullname] [nvarchar](100) NOT NULL,
	[Password] [varchar](1000) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[Created_At] [date] NOT NULL,
	[Gender] [int] NULL,
	[Avatar] [varchar](100) NULL,
	[Email] [varchar](100) NOT NULL,
	[Birthday] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserSubscriptions]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSubscriptions](
	[User_Subscription_Id] [int] IDENTITY(1,1) NOT NULL,
	[Account_Package_Id] [int] NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Start_Day] [date] NOT NULL,
	[End_Day] [date] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[User_Subscription_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserVoucher]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserVoucher](
	[User_Voucher_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Voucher_Id] [int] NOT NULL,
	[Date] [datetime] NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[User_Voucher_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Voucher]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Voucher](
	[Voucher_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Discount_Percent] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Create_Date] [datetime] NOT NULL,
	[End_Date] [datetime] NOT NULL,
	[Created_By] [varchar](100) NOT NULL,
	[Status] [nvarchar](100) NOT NULL,
	[Discount_Code] [varchar](100) NOT NULL,
	[Active_Date] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Voucher_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wallets]    Script Date: 1/27/2025 6:51:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wallets](
	[Wallet_Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NULL,
	[Balance] [decimal](12, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Wallet_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AccountPackageBenefit] ON 

INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (1, 1, 1)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (2, 2, 1)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (3, 3, 2)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (4, 4, 2)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (5, 5, 3)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (6, 6, 3)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (8, 4, 3)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (17, 2, 9)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (18, 6, 9)
INSERT [dbo].[AccountPackageBenefit] ([Account_Package_Benefit_Id], [Benefit_Id], [Account_Package_Id]) VALUES (19, 12, 9)
SET IDENTITY_INSERT [dbo].[AccountPackageBenefit] OFF
GO
SET IDENTITY_INSERT [dbo].[AccountPackages] ON 

INSERT [dbo].[AccountPackages] ([Account_Package_Id], [Package_Name], [Price], [Duration_Days], [Limit_SportFields], [Limit_Bookings], [status]) VALUES (1, N'Gói miễn phí', 0, 9999999, 1, 15, N'active')
INSERT [dbo].[AccountPackages] ([Account_Package_Id], [Package_Name], [Price], [Duration_Days], [Limit_SportFields], [Limit_Bookings], [status]) VALUES (2, N'Gói cơ bản', 100000, 90, 2, 99999999, N'active')
INSERT [dbo].[AccountPackages] ([Account_Package_Id], [Package_Name], [Price], [Duration_Days], [Limit_SportFields], [Limit_Bookings], [status]) VALUES (3, N'Gói nâng cao', 200000, 30, 5, 99999999, N'active')
INSERT [dbo].[AccountPackages] ([Account_Package_Id], [Package_Name], [Price], [Duration_Days], [Limit_SportFields], [Limit_Bookings], [status]) VALUES (9, N'gói bình dân', 100000, 30, 2, 99999, N'un active')
SET IDENTITY_INSERT [dbo].[AccountPackages] OFF
GO
SET IDENTITY_INSERT [dbo].[Address] ON 

INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (1, N'Tỉnh Phú Yên', N'Huyện Tuy An', N'Xã An Chấn')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (2, N'Tỉnh Lai Châu', N'Huyện Tam Đường', N'Xã Bản Bo')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (3, N'Tỉnh Thái Nguyên', N'Huyện Định Hóa', N'Xã Định Biên')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (4, N'Tỉnh Thái Nguyên', N'Huyện Đại Từ', N'Xã Bản Ngoại')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (5, N'Tỉnh Hoà Bình', N'Huyện Đà Bắc', N'Xã Hiền Lương')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (6, N'Tỉnh Lạng Sơn', N'Huyện Tràng Định', N'Xã Chi Lăng')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (7, N'Thành phố Hồ Chí Minh', N'Quận 12', N'Phường Trung Mỹ Tây')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (8, N'Tỉnh Ninh Thuận', N'Huyện Thuận Nam', N'Xã Phước Diêm')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (10, N'Tỉnh Kiên Giang', N'Huyện An Minh', N'Xã Vân Khánh Đông')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (11, N'Tỉnh An Giang', N'Thành phố Châu Đốc', N'Phường Vĩnh Ngươn')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (12, N'Tỉnh Đồng Tháp', N'Thành phố Sa Đéc', N'Xã Tân Khánh Đông')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (13, N'Tỉnh Quảng Bình', N'Huyện Tuyên Hóa', N'Xã Thạch Hóa')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (14, N'Thành phố Hồ Chí Minh', N'Quận Gò Vấp', N'Phường 6')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (16, N'Tỉnh Tiền Giang', N'Huyện Tân Phước', N'Xã Tân Hòa Đông')
INSERT [dbo].[Address] ([Address_Id], [Province], [District], [Ward]) VALUES (17, N'Tỉnh Lào Cai', N'Huyện Si Ma Cai', N'Xã Bản Mế')
SET IDENTITY_INSERT [dbo].[Address] OFF
GO
SET IDENTITY_INSERT [dbo].[AddressUser] ON 

INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (1, N'nguyentuakinapy', 1, N'Thôn Phú Thạnh', 0)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (3, N'nguyentuakinapy', 1, N'Thôn Phú Thạnh', 0)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (4, N'nguyentuakina', 7, N'48/5D2 Tô Ký', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (5, N'nguyentuakina', 1, N'Thôn Phú Thạnh', 0)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (6, N'myntd', 5, N'dsaas', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (9, N'nguyentuakina', 10, N'Ngọc Thành', 0)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (10, N'chusan', 11, N'abc', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (11, N'100928486128195800698', 14, N'Đông Hòa', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (12, N'huuthanh', 13, N'thôn Trai Bản', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (13, N'dieumy', 2, N'Khu phố 1', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (15, N'phihung', 16, N'1321', 1)
INSERT [dbo].[AddressUser] ([Address_User_Id], [Username], [Address_Id], [Address_Detail], [Active]) VALUES (16, N'tanthanh', 17, N'123', 1)
SET IDENTITY_INSERT [dbo].[AddressUser] OFF
GO
SET IDENTITY_INSERT [dbo].[Authorities] ON 

INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (5, 4, N'tanthanh')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (6, 1, N'admin')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (10, 4, N'nguyentuakinapy')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (18, 4, N'nguyenthanhtu')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (31, 4, N'107603460251462154012')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (36, 3, N'nguyentuakinapy')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (37, 4, N'nguyentuakina123')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (39, 3, N'nguyentuakina123')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (47, 4, N'nhanvien')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (48, 2, N'nhanvien')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (69, 1, N'myntd')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (70, 3, N'myntd')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (71, 2, N'myntd')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (77, 3, N'nguyentuakina')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (78, 2, N'nguyentuakina')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (79, 4, N'nguyentuakina')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (103, 4, N'116043414437118260556')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (104, 4, N'tuakina')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (105, 3, N'116043414437118260556')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (108, 4, N'phihung')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (116, 4, N'100928486128195800698')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (117, 3, N'100928486128195800698')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (118, 2, N'100928486128195800698')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (119, 4, N'truonglt')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (120, 4, N'devka123')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (127, 4, N'tupy123')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (128, 3, N'tupy123')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (129, 4, N'tuakinapy')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (130, 3, N'tuakinapy')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (131, 4, N'101794343374621971017')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (132, 4, N'104473904982469285327')
INSERT [dbo].[Authorities] ([Authority_Id], [Authority], [Username]) VALUES (138, 3, N'chusan')
SET IDENTITY_INSERT [dbo].[Authorities] OFF
GO
SET IDENTITY_INSERT [dbo].[Benefits] ON 

INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (1, N'Miễn phí một khu vực sân')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (2, N'Giới hạn 15 lượt đặt sân mỗi tháng')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (3, N'Hai khu vực sân')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (4, N'Không giới hạn lượt đặt sân mỗi tháng')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (5, N'Năm khu vực sân')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (6, N'Được tạo giải đấu và đăng bài viết về sân')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (9, N'lợi ích mới')
INSERT [dbo].[Benefits] ([Benefit_Id], [Description]) VALUES (12, N'Không gới hạn bài đăng')
SET IDENTITY_INSERT [dbo].[Benefits] OFF
GO
SET IDENTITY_INSERT [dbo].[BookingDetails] ON 

INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (992, N'19h00', N'20h30', 1, 300000, 627, CAST(N'2024-12-03' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (993, N'17h30', N'19h30', 2, 800000, 628, CAST(N'2024-12-03' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (994, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-03' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (995, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-10' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (996, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-05' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (997, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-12' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (998, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-07' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (999, N'18h30', N'20h30', 6, 1200000, 629, CAST(N'2024-12-14' AS Date), N'keybooking629', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1000, N'9h00', N'12h00', 1, 700000, 630, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1001, N'16h30', N'18h30', 11, 1300000, 631, CAST(N'2024-12-03' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1002, N'18h30', N'21h00', 9, 800000, 632, CAST(N'2024-12-03' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1003, N'21h00', N'22h00', 19, 300000, 632, CAST(N'2024-12-03' AS Date), N'addNew632', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1004, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-05' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1005, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-13' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1006, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-08' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1007, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-15' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1008, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-10' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1009, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-17' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1010, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-12' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1011, N'18h00', N'21h00', 7, 4536000, 633, CAST(N'2024-12-19' AS Date), N'keybooking633', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1012, N'18h30', N'20h00', 7, 2268000, 634, CAST(N'2024-12-03' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1013, N'16h00', N'17h00', 1, 200000, 635, CAST(N'2024-12-03' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1014, N'11h00', N'12h00', 1, 300000, 636, CAST(N'2024-12-04' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1015, N'16h30', N'18h00', 9, 480000, 637, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1016, N'17h30', N'19h30', 19, 600000, 638, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1017, N'19h00', N'21h30', 13, 750000, 639, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1018, N'20h30', N'22h00', 7, 2268000, 640, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1019, N'12h30', N'14h00', 20, 375000, 641, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1020, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-04' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1021, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-11' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1022, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-06' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1023, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-13' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1024, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-08' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1025, N'18h00', N'19h30', 20, 375000, 642, CAST(N'2024-12-15' AS Date), N'keybooking642', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1026, N'20h00', N'22h00', 8, 1100000, 643, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1027, N'16h30', N'18h00', 11, 975000, 644, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1028, N'13h00', N'15h00', 13, 600000, 645, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1029, N'15h30', N'17h00', 8, 825000, 646, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1030, N'17h00', N'19h00', 8, 1100000, 647, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1031, N'16h00', N'17h30', 12, 1650000, 648, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1032, N'16h30', N'18h00', 7, 2268000, 649, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1033, N'16h30', N'18h30', 19, 600000, 650, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1034, N'19h30', N'21h00', 7, 2268000, 651, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1035, N'17h00', N'18h30', 18, 300000, 652, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1036, N'20h00', N'22h00', 22, 600000, 653, CAST(N'2024-12-04' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1037, N'19h30', N'21h30', 22, 600000, 654, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1038, N'15h00', N'17h00', 13, 600000, 655, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1039, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-05' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1040, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-12' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1041, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-07' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1042, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-14' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1043, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-11' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1044, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-18' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1045, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-09' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1046, N'8h00', N'10h00', 9, 640000, 656, CAST(N'2024-12-16' AS Date), N'keybooking656', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1047, N'17h00', N'18h30', 18, 300000, 655, CAST(N'2024-12-05' AS Date), N'addNew655', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1048, N'20h00', N'22h00', 19, 600000, 657, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1049, N'13h00', N'14h30', 9, 480000, 658, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1056, N'19h30', N'21h00', 13, 450000, 661, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1057, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-05' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1058, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-12' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1059, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-07' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1060, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-14' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1061, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-10' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1062, N'17h00', N'18h00', 19, 300000, 662, CAST(N'2024-12-17' AS Date), N'keybooking662', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1063, N'20h00', N'21h30', 12, 1500000, 663, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1064, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-07' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1065, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-14' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1066, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-09' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1067, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-16' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1068, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-12' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1069, N'12h30', N'14h00', 11, 1075000, 664, CAST(N'2024-12-19' AS Date), N'keybooking664', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1070, N'16h00', N'17h30', 7, 2268000, 665, CAST(N'2024-12-08' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1071, N'21h30', N'23h00', 13, 450000, 666, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1072, N'21h00', N'22h30', 18, 300000, 661, CAST(N'2024-12-05' AS Date), N'addNew661', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1073, N'16h30', N'18h30', 1, 400000, 667, CAST(N'2024-12-06' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1074, N'15h30', N'18h00', 1, 500000, 668, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1075, N'7h30', N'9h00', 8, 825000, 669, CAST(N'2024-12-05' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1076, N'8h30', N'10h30', 1, 400000, 670, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1077, N'6h30', N'8h30', 3, 500000, 671, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1078, N'7h30', N'9h00', 3, 375000, 672, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1079, N'8h00', N'9h30', 7, 2268000, 673, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1080, N'9h00', N'11h00', 7, 3024000, 674, CAST(N'2024-12-11' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1081, N'18h00', N'20h00', 7, 3024000, 675, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1082, N'15h30', N'17h30', 18, 400000, 676, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1083, N'17h30', N'19h00', 22, 450000, 677, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1084, N'8h30', N'10h30', 19, 625000, 678, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1085, N'20h00', N'22h30', 13, 750000, 679, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1086, N'7h30', N'10h00', 11, 1625000, 680, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1087, N'8h00', N'11h00', 20, 750000, 681, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1088, N'18h00', N'20h30', 20, 625000, 682, CAST(N'2024-12-07' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1089, N'18h30', N'20h30', 18, 400000, 683, CAST(N'2024-12-08' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1090, N'19h30', N'21h30', 9, 640000, 684, CAST(N'2024-12-08' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1091, N'19h00', N'21h00', 18, 400000, 685, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1092, N'11h30', N'13h30', 9, 720000, 686, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1093, N'18h30', N'21h00', 12, 2800000, 687, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1094, N'7h30', N'9h00', 20, 375000, 688, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1095, N'8h30', N'10h30', 19, 625000, 689, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1096, N'19h30', N'22h30', 7, 450000, 690, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
GO
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1097, N'9h00', N'11h00', 18, 400000, 691, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1098, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-09' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1099, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-16' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1100, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-11' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1101, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-18' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1102, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-13' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1103, N'14h30', N'17h00', 18, 500000, 692, CAST(N'2024-12-20' AS Date), N'keybooking692', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1104, N'6h00', N'7h00', 21, 150000, 693, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1105, N'7h00', N'8h00', 21, 150000, 694, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1106, N'8h00', N'9h30', 21, 225000, 695, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1107, N'6h00', N'9h00', 21, 450000, 696, CAST(N'2024-12-10' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1108, N'6h00', N'7h00', 21, 150000, 697, CAST(N'2024-12-11' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1109, N'6h00', N'7h30', 21, 225000, 698, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1110, N'7h30', N'9h30', 21, 300000, 701, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1111, N'6h00', N'7h00', 21, 150000, 705, CAST(N'2024-12-11' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1112, N'7h00', N'8h00', 23, 300000, 715, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1113, N'8h00', N'9h00', 23, 300000, 719, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1114, N'9h00', N'10h00', 23, 300000, 720, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1115, N'7h00', N'8h00', 23, 300000, 721, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1116, N'8h00', N'9h00', 23, 300000, 723, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1117, N'7h00', N'8h00', 23, 300000, 724, CAST(N'2024-12-11' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1118, N'9h00', N'10h00', 23, 300000, 727, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1119, N'10h00', N'11h00', 23, 300000, 728, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1120, N'8h00', N'9h00', 23, 300000, 729, CAST(N'2024-12-11' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1121, N'6h00', N'7h00', 1, 200000, 731, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1122, N'7h00', N'8h00', 1, 200000, 732, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1123, N'6h00', N'7h30', 1, 300000, 733, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1124, N'7h30', N'8h30', 1, 200000, 735, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1125, N'8h00', N'9h00', 1, 200000, 738, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1126, N'6h00', N'7h00', 2, 400000, 740, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1127, N'7h00', N'8h30', 2, 600000, 741, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1128, N'7h00', N'8h30', 2, 600000, 742, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1129, N'6h00', N'7h00', 2, 400000, 744, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1130, N'6h00', N'7h00', 2, 400000, 743, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1131, N'7h00', N'8h00', 2, 400000, 745, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1132, N'8h30', N'10h30', 2, 800000, 746, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1133, N'6h00', N'7h00', 1, 200000, 749, CAST(N'2024-12-11' AS Date), N'keybooking749', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1134, N'6h00', N'7h00', 1, 200000, 749, CAST(N'2024-12-18' AS Date), N'keybooking749', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1135, N'6h00', N'7h00', 1, 200000, 749, CAST(N'2024-12-12' AS Date), N'keybooking749', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1136, N'6h00', N'7h00', 1, 200000, 749, CAST(N'2024-12-19' AS Date), N'keybooking749', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1137, N'7h00', N'8h00', 1, 200000, 750, CAST(N'2024-12-11' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1138, N'6h00', N'7h00', 3, 250000, 751, CAST(N'2024-12-10' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1139, N'15h30', N'16h30', 8, 550000, 752, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1140, N'15h30', N'16h30', 1, 200000, 753, CAST(N'2024-12-09' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1141, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-11' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1142, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-18' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1143, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-13' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1144, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-20' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1145, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-15' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1146, N'15h30', N'17h00', 7, 225000, 754, CAST(N'2024-12-22' AS Date), N'keybooking754', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1147, N'19h00', N'21h30', 7, 375000, 755, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1148, N'16h30', N'17h30', 23, 300000, 756, CAST(N'2024-12-09' AS Date), N'createKey', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1149, N'15h00', N'16h00', 23, 300000, 757, CAST(N'2024-12-10' AS Date), N'createKey', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1150, N'16h00', N'17h00', 23, 300000, 758, CAST(N'2024-12-11' AS Date), N'', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1151, N'16h00', N'17h00', 23, 300000, 758, CAST(N'2024-12-18' AS Date), N'', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1152, N'16h00', N'17h00', 23, 300000, 758, CAST(N'2024-12-12' AS Date), N'', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1153, N'16h00', N'17h00', 23, 300000, 758, CAST(N'2024-12-19' AS Date), N'', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1154, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-10' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1155, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-17' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1156, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-12' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1157, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-19' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1158, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-14' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1159, N'15h00', N'16h00', 3, 250000, 759, CAST(N'2024-12-21' AS Date), N'keybooking759', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1160, N'7h00', N'8h00', 14, 100000, 760, CAST(N'2024-12-11' AS Date), N'keybooking760', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1161, N'7h00', N'8h00', 14, 100000, 760, CAST(N'2024-12-18' AS Date), N'keybooking760', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1162, N'7h00', N'8h00', 14, 100000, 760, CAST(N'2024-12-13' AS Date), N'keybooking760', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1163, N'7h00', N'8h00', 14, 100000, 760, CAST(N'2024-12-20' AS Date), N'keybooking760', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1164, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-12' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1165, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-19' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1166, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-14' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1167, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-21' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1168, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-16' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1169, N'16h00', N'17h30', 3, 375000, 761, CAST(N'2024-12-23' AS Date), N'keybooking761', N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1170, N'17h30', N'19h00', 7, 225000, 762, CAST(N'2024-12-12' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1171, N'15h30', N'17h00', 16, 300000, 763, CAST(N'2024-12-10' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1172, N'8h00', N'9h00', 17, 200000, 764, CAST(N'2024-12-10' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1173, N'8h00', N'9h30', 1, 300000, 765, CAST(N'2024-12-14' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1174, N'9h00', N'12h00', 23, 900000, 766, CAST(N'2024-12-12' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1175, N'8h30', N'11h30', 23, 900000, 767, CAST(N'2024-12-13' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1176, N'7h00', N'8h30', 1, 300000, 768, CAST(N'2024-12-13' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1177, N'11h30', N'13h30', 18, 450000, 769, CAST(N'2024-12-12' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1178, N'8h00', N'9h30', 23, 450000, 770, CAST(N'2024-12-16' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1179, N'17h30', N'19h30', 9, 640000, 771, CAST(N'2024-12-11' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1180, N'8h30', N'11h00', 17, 550000, 772, CAST(N'2024-12-12' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1181, N'19h00', N'21h00', 18, 400000, 773, CAST(N'2024-12-11' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1182, N'15h00', N'16h00', 3, 250000, 774, CAST(N'2024-12-18' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1183, N'8h00', N'9h00', 7, 150000, 775, CAST(N'2024-12-14' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1184, N'16h00', N'17h00', 7, 150000, 776, CAST(N'2024-12-14' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1185, N'8h00', N'9h00', 7, 150000, 777, CAST(N'2024-12-14' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1186, N'17h00', N'18h00', 7, 150000, 778, CAST(N'2024-12-14' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1187, N'17h00', N'18h00', 7, 150000, 779, CAST(N'2024-12-14' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1188, N'18h00', N'19h00', 7, 150000, 780, CAST(N'2024-12-14' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1189, N'15h00', N'16h00', 7, 150000, 781, CAST(N'2024-12-14' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1190, N'18h30', N'20h00', 13, 450000, 782, CAST(N'2024-12-15' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1191, N'16h00', N'17h00', 11, 650000, 783, CAST(N'2024-12-15' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1192, N'17h30', N'19h00', 7, 225000, 784, CAST(N'2024-12-15' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1193, N'18h30', N'20h00', 26, 150000, 785, CAST(N'2024-12-15' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1194, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-16' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1195, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-23' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1196, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-30' AS Date), N'keybooking786', N'Đã hủy')
GO
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1197, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-06' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1198, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-13' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1199, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-18' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1200, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-25' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1201, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-01' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1202, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-08' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1203, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-15' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1204, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-20' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1205, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2024-12-27' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1206, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-03' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1207, N'7h30', N'10h00', 25, 300000, 786, CAST(N'2025-01-10' AS Date), N'keybooking786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1208, N'10h00', N'11h30', 26, 160000, 786, CAST(N'2024-12-16' AS Date), N'addNew786', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1209, N'16h00', N'17h30', 26, 150000, 787, CAST(N'2024-12-17' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1210, N'17h00', N'19h00', 26, 200000, 788, CAST(N'2024-12-17' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1211, N'17h30', N'20h00', 25, 300000, 789, CAST(N'2024-12-17' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1212, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-16' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1213, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-23' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1214, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-18' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1215, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-25' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1216, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-20' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1217, N'13h30', N'15h00', 26, 150000, 790, CAST(N'2024-12-27' AS Date), N'keybooking790', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1218, N'8h00', N'10h00', 26, 200000, 791, CAST(N'2024-12-16' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1219, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-17' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1220, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-24' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1221, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-19' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1222, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-26' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1223, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-21' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1224, N'11h30', N'13h00', 25, 210000, 792, CAST(N'2024-12-28' AS Date), N'keybooking792', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1225, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-18' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1226, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-25' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1227, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-17' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1228, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-24' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1229, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-20' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1230, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-27' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1231, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-22' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1232, N'11h30', N'13h30', 25, 270000, 793, CAST(N'2024-12-29' AS Date), N'keybooking793', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1233, N'19h00', N'21h00', 25, 240000, 794, CAST(N'2024-12-15' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1234, N'18h00', N'20h30', 26, 250000, 795, CAST(N'2024-12-16' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1235, N'10h00', N'12h00', 26, 220000, 796, CAST(N'2024-12-16' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1236, N'17h30', N'19h30', 3, 500000, 797, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1237, N'19h00', N'22h00', 27, 300000, 801, CAST(N'2024-12-16' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1238, N'9h00', N'12h00', 27, 340000, 802, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1239, N'12h00', N'14h00', 27, 210000, 802, CAST(N'2024-12-17' AS Date), N'addNew802', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1240, N'13h30', N'16h30', 28, 450000, 803, CAST(N'2024-12-17' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1241, N'13h30', N'16h00', 28, 375000, 803, CAST(N'2024-12-24' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1242, N'13h30', N'16h00', 28, 375000, 803, CAST(N'2024-12-19' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1243, N'13h30', N'16h00', 28, 375000, 803, CAST(N'2024-12-26' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1244, N'13h30', N'16h00', 28, 375000, 803, CAST(N'2024-12-21' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1245, N'13h30', N'16h00', 28, 375000, 803, CAST(N'2024-12-28' AS Date), N'keybooking803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1246, N'16h30', N'18h00', 28, 225000, 803, CAST(N'2024-12-17' AS Date), N'addNew803', N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1247, N'15h00', N'16h00', 1, 200000, 804, CAST(N'2024-12-17' AS Date), NULL, N'Đã hủy')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1248, N'7h00', N'9h00', 21, 300000, 805, CAST(N'2024-12-18' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1249, N'7h30', N'9h30', 9, 640000, 806, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1250, N'10h30', N'12h30', 19, 700000, 807, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1251, N'13h30', N'15h30', 13, 600000, 808, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1252, N'14h00', N'15h30', 7, 225000, 809, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1253, N'8h00', N'10h00', 8, 1100000, 810, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1254, N'9h00', N'10h30', 20, 375000, 811, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1255, N'11h00', N'12h30', 11, 1125000, 812, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1256, N'6h30', N'8h00', 1, 300000, 813, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1257, N'7h30', N'9h30', 1, 400000, 814, CAST(N'2024-12-19' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1258, N'7h30', N'9h30', 7, 300000, 815, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1259, N'20h30', N'22h00', 9, 480000, 816, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1260, N'14h00', N'15h30', 7, 225000, 817, CAST(N'2024-12-18' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1261, N'18h00', N'19h30', 7, 225000, 818, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1262, N'16h00', N'18h00', 11, 1300000, 819, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1263, N'16h00', N'17h30', 9, 480000, 820, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
INSERT [dbo].[BookingDetails] ([Booking_Detail_Id], [Start_Time], [End_Time], [Sport_Field_Detail_Id], [Price], [Booking_Id], [Date], [Subscription_Key], [Status]) VALUES (1264, N'17h30', N'19h00', 9, 480000, 821, CAST(N'2024-12-17' AS Date), NULL, N'Đã hoàn thành')
SET IDENTITY_INSERT [dbo].[BookingDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Bookings] ON 

INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (627, CAST(N'2024-12-03T14:50:12.590' AS DateTime), N'sportoffline', 300000, N'Chờ thanh toán', 6, 1, NULL, NULL, N'Nguyễn Tú', N'', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (628, CAST(N'2024-12-03T14:50:19.157' AS DateTime), N'sportoffline', 800000, N'Đã thanh toán', 6, 1, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (629, CAST(N'2024-12-03T14:51:09.477' AS DateTime), N'sportoffline', 7200000, N'Đã thanh toán', 6, 1, NULL, NULL, N'Hoàng Hữu Thành', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (630, CAST(N'2024-12-03T14:54:25.670' AS DateTime), N'sportoffline', 700000, N'Đã thanh toán', 6, 1, NULL, NULL, N'Nguyễn Tú', N'0236587512', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (631, CAST(N'2024-12-03T15:28:39.480' AS DateTime), N'sportoffline', 1300000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'0236587512', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (632, CAST(N'2024-12-03T15:30:09.600' AS DateTime), N'sportoffline', 1100000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 30, 1000000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (633, CAST(N'2024-12-03T15:39:05.863' AS DateTime), N'sportoffline', 31752000, N'Đã hủy', 6, 3, NULL, NULL, N'Phi Hùng', N'0369678318', 70, 36288000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (634, CAST(N'2024-12-03T15:45:20.300' AS DateTime), N'sportoffline', 2268000, N'Đã hủy', 6, 3, NULL, N'Hủy bởi chủ sân', N'Nguyễn Hương', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (635, CAST(N'2024-12-03T15:52:17.680' AS DateTime), N'nguyentuakina', 200000, N'Đã thanh toán', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (636, CAST(N'2024-12-03T15:55:05.057' AS DateTime), N'nguyentuakina', 300000, N'Đã hủy', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (637, CAST(N'2024-12-04T15:39:12.880' AS DateTime), N'sportoffline', 480000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (638, CAST(N'2024-12-04T15:40:37.593' AS DateTime), N'sportoffline', 600000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 70, 450000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (639, CAST(N'2024-12-04T15:41:38.010' AS DateTime), N'sportoffline', 750000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'0369678318', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (640, CAST(N'2024-12-04T15:43:17.097' AS DateTime), N'sportoffline', 2268000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (641, CAST(N'2024-12-04T15:45:13.560' AS DateTime), N'sportoffline', 375000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Thanh Hà', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (642, CAST(N'2024-12-04T15:45:48.317' AS DateTime), N'sportoffline', 2250000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Quốc Anh', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (643, CAST(N'2024-12-04T15:46:54.660' AS DateTime), N'sportoffline', 1100000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Xuân Lộc', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (644, CAST(N'2024-12-04T15:47:16.753' AS DateTime), N'sportoffline', 975000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (645, CAST(N'2024-12-04T15:50:36.077' AS DateTime), N'sportoffline', 600000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (646, CAST(N'2024-12-04T15:54:27.407' AS DateTime), N'nguyentuakina', 825000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (647, CAST(N'2024-12-04T15:54:46.493' AS DateTime), N'nguyentuakina', 1100000, N'Đã thanh toán', 2, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (648, CAST(N'2024-12-04T15:55:32.760' AS DateTime), N'nguyentuakina', 1650000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (649, CAST(N'2024-12-04T15:56:05.183' AS DateTime), N'phihung', 2268000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Phi Hùng', N'0963861480', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (650, CAST(N'2024-12-04T15:56:29.750' AS DateTime), N'phihung', 600000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Phi Hùng', N'0963861480', 70, 450000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (651, CAST(N'2024-12-04T15:57:10.590' AS DateTime), N'myntd', 2268000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (652, CAST(N'2024-12-04T15:57:37.043' AS DateTime), N'myntd', 300000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (653, CAST(N'2024-12-04T15:57:50.823' AS DateTime), N'myntd', 600000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (654, CAST(N'2024-12-04T15:58:05.227' AS DateTime), N'myntd', 600000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (655, CAST(N'2024-12-04T15:59:48.650' AS DateTime), N'sportoffline', 900000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 40, 600000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (656, CAST(N'2024-12-04T16:02:36.973' AS DateTime), N'sportoffline', 5120000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (657, CAST(N'2024-12-04T17:06:02.123' AS DateTime), N'sportoffline', 600000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (658, CAST(N'2024-12-04T17:06:31.617' AS DateTime), N'sportoffline', 480000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (661, CAST(N'2024-12-04T17:19:13.367' AS DateTime), N'sportoffline', 750000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 40, 450000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (662, CAST(N'2024-12-04T17:23:13.727' AS DateTime), N'sportoffline', 1800000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (663, CAST(N'2024-12-04T17:25:18.140' AS DateTime), N'sportoffline', 1500000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (664, CAST(N'2024-12-04T17:25:56.640' AS DateTime), N'sportoffline', 6450000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'0123456789', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (665, CAST(N'2024-12-04T17:28:52.863' AS DateTime), N'nguyentuakina', 2268000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (666, CAST(N'2024-12-04T22:25:41.867' AS DateTime), N'sportoffline', 450000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (667, CAST(N'2024-12-04T22:46:04.513' AS DateTime), N'nguyentuakina', 400000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (668, CAST(N'2024-12-04T22:47:06.113' AS DateTime), N'nguyentuakina', 500000, N'Đã thanh toán', 1, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (669, CAST(N'2024-12-05T00:03:05.407' AS DateTime), N'myntd', 825000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (670, CAST(N'2024-12-05T00:08:43.227' AS DateTime), N'sportoffline', 400000, N'Chờ thanh toán', 6, 1, NULL, NULL, N'Nguyễn Tú', N'', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (671, CAST(N'2024-12-07T04:08:29.973' AS DateTime), N'nguyentuakina', 500000, N'Chờ thanh toán', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (672, CAST(N'2024-12-07T04:08:40.320' AS DateTime), N'nguyentuakina', 375000, N'Chờ thanh toán', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (673, CAST(N'2024-12-07T04:09:05.593' AS DateTime), N'nguyentuakina', 2268000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (674, CAST(N'2024-12-07T04:09:11.190' AS DateTime), N'nguyentuakina', 3024000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (675, CAST(N'2024-12-07T04:09:17.907' AS DateTime), N'nguyentuakina', 3024000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (676, CAST(N'2024-12-07T04:09:24.150' AS DateTime), N'nguyentuakina', 400000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (677, CAST(N'2024-12-07T04:09:37.123' AS DateTime), N'nguyentuakina', 450000, N'Chờ thanh toán', 7, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (678, CAST(N'2024-12-07T04:11:05.003' AS DateTime), N'sportoffline', 625000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (679, CAST(N'2024-12-07T04:11:12.597' AS DateTime), N'sportoffline', 750000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (680, CAST(N'2024-12-07T04:11:22.200' AS DateTime), N'sportoffline', 1625000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (681, CAST(N'2024-12-07T04:11:33.493' AS DateTime), N'sportoffline', 750000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (682, CAST(N'2024-12-07T04:11:51.500' AS DateTime), N'sportoffline', 625000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Tấn Thành', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (683, CAST(N'2024-12-08T16:54:18.993' AS DateTime), N'sportoffline', 400000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (684, CAST(N'2024-12-08T16:54:30.703' AS DateTime), N'sportoffline', 640000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (685, CAST(N'2024-12-09T01:03:55.593' AS DateTime), N'sportoffline', 400000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Xuân Lộc', N'0236587512', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (686, CAST(N'2024-12-09T01:04:11.520' AS DateTime), N'sportoffline', 720000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Ngọc Mạnh', N'0254132684', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (687, CAST(N'2024-12-09T01:04:36.533' AS DateTime), N'sportoffline', 2800000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Thành Đạt', N'', 80, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (688, CAST(N'2024-12-09T01:04:54.727' AS DateTime), N'sportoffline', 375000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Minh Hùng', N'0123456789', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (689, CAST(N'2024-12-09T01:09:47.683' AS DateTime), N'sportoffline', 625000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (690, CAST(N'2024-12-09T01:11:32.703' AS DateTime), N'sportoffline', 450000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (691, CAST(N'2024-12-09T01:12:31.767' AS DateTime), N'sportoffline', 400000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (692, CAST(N'2024-12-09T01:14:25.647' AS DateTime), N'sportoffline', 3000000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Phi Hùng', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (693, CAST(N'2024-12-09T01:20:48.040' AS DateTime), N'100928486128195800698', 150000, N'Chờ thanh toán', 1, 13, NULL, NULL, N'Ngân Vũ', N'0374862645', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (694, CAST(N'2024-12-09T01:39:46.210' AS DateTime), N'100928486128195800698', 150000, N'Chờ thanh toán', 7, 13, NULL, NULL, N'Ngân Vũ', N'0374862645', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (695, CAST(N'2024-12-09T02:36:33.433' AS DateTime), N'chusan', 225000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (696, CAST(N'2024-12-09T02:39:45.573' AS DateTime), N'chusan', 450000, N'Đã hủy', 7, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (697, CAST(N'2024-12-09T02:44:55.033' AS DateTime), N'chusan', 150000, N'Đã hủy', 7, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (698, CAST(N'2024-12-09T02:49:53.977' AS DateTime), N'chusan', 225000, N'Đã thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (701, CAST(N'2024-12-09T03:10:21.893' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 1, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (705, CAST(N'2024-12-09T03:28:51.413' AS DateTime), N'chusan', 150000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (715, CAST(N'2024-12-09T04:00:40.200' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (719, CAST(N'2024-12-09T04:31:04.917' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (720, CAST(N'2024-12-09T04:32:14.770' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (721, CAST(N'2024-12-09T04:33:17.073' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (723, CAST(N'2024-12-09T04:35:21.327' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (724, CAST(N'2024-12-09T04:44:06.360' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (727, CAST(N'2024-12-09T04:51:50.010' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (728, CAST(N'2024-12-09T04:54:49.903' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (729, CAST(N'2024-12-09T04:56:01.750' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 1, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (731, CAST(N'2024-12-09T05:00:25.363' AS DateTime), N'chusan', 200000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (732, CAST(N'2024-12-09T05:00:57.903' AS DateTime), N'chusan', 200000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (733, CAST(N'2024-12-09T05:16:25.163' AS DateTime), N'chusan', 300000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (735, CAST(N'2024-12-09T05:21:17.647' AS DateTime), N'chusan', 200000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (738, CAST(N'2024-12-09T05:25:07.930' AS DateTime), N'chusan', 200000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (740, CAST(N'2024-12-09T05:32:03.203' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 7, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (741, CAST(N'2024-12-09T06:25:54.960' AS DateTime), N'chusan', 600000, N'Đã thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (742, CAST(N'2024-12-09T06:25:54.960' AS DateTime), N'chusan', 600000, N'Đã thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (743, CAST(N'2024-12-09T06:28:21.907' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (744, CAST(N'2024-12-09T06:28:21.907' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (745, CAST(N'2024-12-09T06:38:27.317' AS DateTime), N'chusan', 400000, N'Đã thanh toán', 2, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (746, CAST(N'2024-12-09T06:41:44.977' AS DateTime), N'chusan', 800000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (747, CAST(N'2024-12-09T06:59:38.957' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (748, CAST(N'2024-12-09T07:03:24.137' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (749, CAST(N'2024-12-09T14:39:02.593' AS DateTime), N'myntd', 300000, N'Đã hủy', 1, 1, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (750, CAST(N'2024-12-09T14:53:06.737' AS DateTime), N'chusan', 200000, N'Đã hủy', 7, 1, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (751, CAST(N'2024-12-09T15:00:45.390' AS DateTime), N'chusan', 250000, N'Đã hủy', 1, 1, NULL, N'Hủy bởi chủ sân', N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (752, CAST(N'2024-12-09T15:04:38.687' AS DateTime), N'chusan', 550000, N'Chờ thanh toán', 1, 3, NULL, NULL, N'Nguyen Van B', NULL, 50, 0)
GO
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (753, CAST(N'2024-12-09T15:26:57.517' AS DateTime), N'myntd', 200000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (754, CAST(N'2024-12-09T15:54:03.340' AS DateTime), N'nguyentuakina', 1350000, N'Chờ thanh toán', 2, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (755, CAST(N'2024-12-09T15:56:19.753' AS DateTime), N'sportoffline', 375000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (756, CAST(N'2024-12-09T16:04:15.317' AS DateTime), N'chusan', 1200000, N'Chờ thanh toán', 1, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (757, CAST(N'2024-12-09T16:18:38.157' AS DateTime), N'chusan', 1200000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (758, CAST(N'2024-12-09T16:30:13.053' AS DateTime), N'chusan', 1200000, N'Chờ thanh toán', 2, 13, NULL, NULL, N'Nguyen Van B', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (759, CAST(N'2024-12-09T16:37:39.643' AS DateTime), N'chusan', 1500000, N'Chờ thanh toán', 1, 1, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (760, CAST(N'2024-12-09T16:39:20.090' AS DateTime), N'chusan', 400000, N'Chờ thanh toán', 2, 6, NULL, NULL, N'Nguyen Van B', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (761, CAST(N'2024-12-09T17:27:29.447' AS DateTime), N'nguyentuakina', 2250000, N'Chờ thanh toán', 2, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (762, CAST(N'2024-12-09T17:30:55.863' AS DateTime), N'nguyentuakina', 225000, N'Đã thanh toán', 2, 3, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (763, CAST(N'2024-12-09T22:31:02.530' AS DateTime), N'nguyentuakina', 300000, N'Chờ thanh toán', 7, 6, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 60, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (764, CAST(N'2024-12-10T03:17:10.070' AS DateTime), N'truonglt', 200000, N'Đã hủy', 1, 11, NULL, NULL, N'Le Thanh truong', NULL, 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (765, CAST(N'2024-12-10T03:19:20.127' AS DateTime), N'truonglt', 300000, N'Đã hủy', 1, 1, NULL, NULL, N'Le Thanh truong', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (766, CAST(N'2024-12-10T03:27:11.477' AS DateTime), N'truonglt', 900000, N'Đã thanh toán', 2, 13, NULL, NULL, N'Le Thanh truong', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (767, CAST(N'2024-12-10T03:27:36.827' AS DateTime), N'truonglt', 900000, N'Chờ thanh toán', 1, 13, NULL, NULL, N'Le Thanh truong', NULL, 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (768, CAST(N'2024-12-11T13:55:56.170' AS DateTime), N'nguyentuakina', 300000, N'Đã thanh toán', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (769, CAST(N'2024-12-11T13:56:33.757' AS DateTime), N'sportoffline', 450000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (770, CAST(N'2024-12-11T14:37:52.990' AS DateTime), N'nguyentuakina', 450000, N'Đã thanh toán', 1, 13, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (771, CAST(N'2024-12-11T14:47:28.273' AS DateTime), N'sportoffline', 640000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Tú', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (772, CAST(N'2024-12-11T14:52:09.293' AS DateTime), N'nguyentuakina', 550000, N'Đã thanh toán', 2, 11, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (773, CAST(N'2024-12-11T14:55:45.040' AS DateTime), N'sportoffline', 400000, N'Đã hủy', 6, 3, NULL, N'Hủy bởi chủ sân', N'Nguyễn Hương', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (774, CAST(N'2024-12-13T15:33:43.470' AS DateTime), N'nguyentuakina', 250000, N'Đã hủy', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (775, CAST(N'2024-12-13T16:16:48.523' AS DateTime), N'myntd', 150000, N'Đã hủy', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (776, CAST(N'2024-12-13T16:18:39.840' AS DateTime), N'myntd', 150000, N'Đã hủy', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (777, CAST(N'2024-12-13T16:19:42.143' AS DateTime), N'myntd', 150000, N'Đã hủy', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (778, CAST(N'2024-12-13T16:21:19.983' AS DateTime), N'myntd', 150000, N'Đã hủy', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (779, CAST(N'2024-12-13T16:22:51.650' AS DateTime), N'myntd', 150000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (780, CAST(N'2024-12-13T16:25:27.483' AS DateTime), N'myntd', 150000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (781, CAST(N'2024-12-13T16:26:52.407' AS DateTime), N'myntd', 150000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (782, CAST(N'2024-12-15T14:18:19.390' AS DateTime), N'sportoffline', 450000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (783, CAST(N'2024-12-15T14:19:13.263' AS DateTime), N'sportoffline', 650000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Thu Hà', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (784, CAST(N'2024-12-15T16:49:08.087' AS DateTime), N'myntd', 225000, N'Đã hủy', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0369678318', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (785, CAST(N'2024-12-15T17:44:37.867' AS DateTime), N'sportoffline', 150000, N'Đã hủy', 6, 44, NULL, N'Hủy bởi yêu cầu của khách hàng', N'Hoàng Hữu Thành', N'', 40, 360000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (786, CAST(N'2024-12-15T17:51:34.143' AS DateTime), N'sportoffline', 4200000, N'Đã hủy', 6, 44, NULL, NULL, N'Gia Bảo', N'0369678318', 40, 4360000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (787, CAST(N'2024-12-15T17:53:42.687' AS DateTime), N'sportoffline', 150000, N'Đã hủy', 6, 44, NULL, NULL, N'Hoàng Hữu Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (788, CAST(N'2024-12-15T17:59:16.523' AS DateTime), N'sportoffline', 200000, N'Đã hủy', 6, 44, NULL, NULL, N'Hoàng Hữu Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (789, CAST(N'2024-12-15T17:59:53.360' AS DateTime), N'sportoffline', 300000, N'Đã hủy', 6, 44, NULL, NULL, N'Nguyễn Thanh Tú', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (790, CAST(N'2024-12-15T18:07:32.487' AS DateTime), N'sportoffline', 900000, N'Đã hủy', 6, 44, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0254132684', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (791, CAST(N'2024-12-15T18:08:27.507' AS DateTime), N'sportoffline', 200000, N'Đã thanh toán', 6, 44, NULL, NULL, N'Hoàng Hữu Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (792, CAST(N'2024-12-15T18:08:42.143' AS DateTime), N'sportoffline', 1260000, N'Đã hủy', 6, 44, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0236587512', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (793, CAST(N'2024-12-15T18:12:03.870' AS DateTime), N'sportoffline', 2160000, N'Đã hủy', 6, 44, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0236587512', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (794, CAST(N'2024-12-15T18:20:54.417' AS DateTime), N'sportoffline', 240000, N'Đã hủy', 6, 44, NULL, N'Hủy bởi chủ sân', N'Võ Tấn Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (795, CAST(N'2024-12-15T18:21:18.367' AS DateTime), N'sportoffline', 250000, N'Đã hủy', 6, 44, NULL, N'Hủy bởi chủ sân', N'Quốc Anh', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (796, CAST(N'2024-12-15T18:23:25.633' AS DateTime), N'sportoffline', 220000, N'Đã hủy', 6, 44, NULL, N'Hủy bởi chủ sân', N'Hoàng Hữu Thành', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (797, CAST(N'2024-12-15T18:46:25.267' AS DateTime), N'phihung', 500000, N'Đã thanh toán', 2, 1, NULL, NULL, N'Nguyễn Phi Hùng', N'0963861480', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (800, CAST(N'2024-12-15T18:46:25.267' AS DateTime), N'sportoffline', 1240000, N'Đã thanh toán', 2, 1, NULL, NULL, N'Hoàng Hữu Thành', N'0389888888', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (801, CAST(N'2024-12-16T18:08:50.357' AS DateTime), N'sportoffline', 300000, N'Chờ thanh toán', 6, 45, NULL, NULL, N'Gia Bảo', N'', 40, 300000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (802, CAST(N'2024-12-16T18:10:09.263' AS DateTime), N'sportoffline', 340000, N'Đã thanh toán', 6, 45, NULL, NULL, N'Hữu Thành', N'', 40, 550000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (803, CAST(N'2024-12-16T18:11:43.370' AS DateTime), N'sportoffline', 1950000, N'Đã hủy', 6, 45, NULL, NULL, N'Tú', N'0123456789', 50, 2175000)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (804, CAST(N'2024-12-16T18:16:47.690' AS DateTime), N'phihung', 200000, N'Đã hủy', 7, 1, NULL, NULL, N'Nguyễn Phi Hùng', N'0365131846', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (805, CAST(N'2024-12-16T23:28:19.123' AS DateTime), N'nguyentuakina', 300000, N'Đã thanh toán', 7, 13, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (806, CAST(N'2024-12-16T23:39:53.910' AS DateTime), N'sportoffline', 640000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (807, CAST(N'2024-12-16T23:40:04.530' AS DateTime), N'sportoffline', 700000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Hoàng Hữu Thành', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (808, CAST(N'2024-12-16T23:40:25.210' AS DateTime), N'sportoffline', 600000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Mỹ Diệu', N'', 40, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (809, CAST(N'2024-12-16T23:40:46.453' AS DateTime), N'sportoffline', 225000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Thanh Tú', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (810, CAST(N'2024-12-16T23:41:03.810' AS DateTime), N'sportoffline', 1100000, N'Chờ thanh toán', 6, 3, NULL, NULL, N'Hùng', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (811, CAST(N'2024-12-16T23:41:14.873' AS DateTime), N'sportoffline', 375000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Trọng Phúc', N'', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (812, CAST(N'2024-12-16T23:41:30.837' AS DateTime), N'sportoffline', 1125000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Thãnh Hừu', N'', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (813, CAST(N'2024-12-17T00:54:07.120' AS DateTime), N'nguyentuakina', 300000, N'Chờ thanh toán', 7, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (814, CAST(N'2024-12-17T00:55:04.883' AS DateTime), N'nguyentuakina', 400000, N'Đã thanh toán', 2, 1, NULL, NULL, N'Nguyễn Tú Akina', N'0369678318', 20, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (815, CAST(N'2024-12-17T01:09:25.357' AS DateTime), N'myntd', 300000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0374968107', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (816, CAST(N'2024-12-17T01:15:20.720' AS DateTime), N'myntd', 480000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0374968107', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (817, CAST(N'2024-12-17T11:18:49.290' AS DateTime), N'phihung', 225000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Phùng Hi', N'0365131846', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (818, CAST(N'2024-12-17T12:16:07.340' AS DateTime), N'myntd', 225000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0374968107', 70, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (819, CAST(N'2024-12-17T12:18:08.340' AS DateTime), N'myntd', 1300000, N'Đã thanh toán', 1, 3, NULL, NULL, N'Nguyễn Thị Diệu Mỵ', N'0374968107', 50, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (820, CAST(N'2024-12-17T13:17:41.203' AS DateTime), N'sportoffline', 480000, N'Đã thanh toán', 6, 3, NULL, NULL, N'Nguyễn Hương', N'', 30, 0)
INSERT [dbo].[Bookings] ([Booking_Id], [Date], [Username], [Total_Amount], [Status], [Payment_Method_Id], [Owner_Id], [Voucher_Id], [Note], [Full_Name], [Phone_Number], [Percent_Deposit], [Old_Total_Amount]) VALUES (821, CAST(N'2024-12-17T13:21:45.487' AS DateTime), N'phihung', 480000, N'Đã thanh toán', 7, 3, NULL, NULL, N'Nguyễn Phùng Hi', N'0365131846', 30, 0)
SET IDENTITY_INSERT [dbo].[Bookings] OFF
GO
SET IDENTITY_INSERT [dbo].[Carts] ON 

INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (90, N'100928486128195800698', 26, CAST(N'2024-12-02T15:10:36.427' AS DateTime), 150, 10)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (91, N'100928486128195800698', 25, CAST(N'2024-12-02T15:10:38.200' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (93, N'107603460251462154012', 25, CAST(N'2024-12-02T15:11:16.750' AS DateTime), 150, 2)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (94, N'107603460251462154012', 26, CAST(N'2024-12-02T15:11:18.530' AS DateTime), 150, 3)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (98, N'100928486128195800698', 27, CAST(N'2024-12-02T15:45:45.793' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (128, N'tanthanh', 62, CAST(N'2024-12-04T19:53:34.590' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (130, N'tufpt', 31, CAST(N'2024-12-04T19:55:39.053' AS DateTime), 150, 2)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (133, N'100928486128195800698', 56, CAST(N'2024-12-09T01:17:50.307' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (145, N'nguyentuakina', 92, CAST(N'2024-12-11T16:53:28.747' AS DateTime), 150, 10)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (146, N'dieumy', 22, CAST(N'2024-12-13T01:00:49.697' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (156, N'nguyentuakina', 82, CAST(N'2024-12-15T16:50:11.270' AS DateTime), 150, 2)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (157, N'nguyentuakina', 22, CAST(N'2024-12-15T16:50:16.990' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (158, N'nguyentuakina', 94, CAST(N'2024-12-15T17:28:15.550' AS DateTime), 150, 10)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (163, N'phihung', 92, CAST(N'2024-12-15T19:39:34.350' AS DateTime), 150, 2)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (164, N'nguyentuakina', 31, CAST(N'2024-12-15T21:59:42.470' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (167, N'huuthanh', 93, CAST(N'2024-12-15T22:59:44.243' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (168, N'huuthanh', 58, CAST(N'2024-12-15T23:00:52.490' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (173, N'tanthanh', 60, CAST(N'2024-12-17T00:14:36.267' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (174, N'tanthanh', 87, CAST(N'2024-12-17T00:14:42.910' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (175, N'tanthanh', 30, CAST(N'2024-12-17T00:14:48.943' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (176, N'chusan', 90, CAST(N'2024-12-17T08:55:46.290' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (177, N'chusan', 59, CAST(N'2024-12-17T08:55:58.670' AS DateTime), 150, 1)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (178, N'nguyentuakina', 97, CAST(N'2024-12-17T11:31:55.820' AS DateTime), 150, 4)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (179, N'nguyentuakina', 87, CAST(N'2024-12-17T13:34:15.570' AS DateTime), 150, 2)
INSERT [dbo].[Carts] ([Cart_Id], [Username], [Product_Detail_Size_Id], [Date], [Total_Amount ], [Quantity]) VALUES (181, N'myntd', 94, CAST(N'2024-12-21T15:47:51.113' AS DateTime), 150, 10)
SET IDENTITY_INSERT [dbo].[Carts] OFF
GO
SET IDENTITY_INSERT [dbo].[CategoriesField] ON 

INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (1, N'Bóng đá', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733211884/fuwsqjcedqedxy91nfgl.jpg')
INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (2, N'Bóng chuyền', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334525/zxhiwuypki3tgbq0z0dd.jpg')
INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (3, N'Cầu lông', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334568/rf2fhsd5zzdcljpqywhv.webp')
INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (4, N'Bóng bàn', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334595/bxxst6xzpshzi37znnwn.jpg')
INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (5, N'Tenis', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334639/fcyw9d0gdsfwevfddwjh.jpg')
INSERT [dbo].[CategoriesField] ([Categories_Field_Id], [Name], [Image]) VALUES (9, N'Pickleball', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334788/a7howbdjokww6deenoxj.webp')
SET IDENTITY_INSERT [dbo].[CategoriesField] OFF
GO
SET IDENTITY_INSERT [dbo].[CategoriesProduct] ON 

INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (1, N'Bóng đá', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734334957/c6ww3tkam32oewxqd2rn.jpg')
INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (2, N'Bóng chuyền', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734335056/ngj1kw2qymzgzpvjl9ej.jpg')
INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (3, N'Cầu lông', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734335129/g9bfyd7ujoiywhcck3xz.jpg')
INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (4, N'Bóng bàn', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734335168/dbpmljtgiomktlvgc1iq.avif')
INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (6, N'Bóng rổ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734335205/majkbowyg36pvohtkvad.jpg')
INSERT [dbo].[CategoriesProduct] ([Category_Product_Id], [Name], [Image]) VALUES (13, N'Pickleball', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194243/mvdywa3e74ujpjrpti8f.jpg')
SET IDENTITY_INSERT [dbo].[CategoriesProduct] OFF
GO
SET IDENTITY_INSERT [dbo].[FieldReviews] ON 

INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (3, 3, N'nguyentuakina', 5, N'Sân sất đẹp xứng đáng 4 sao', CAST(N'2024-10-31T02:02:19.230' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (4, 2, N'nguyentuakina', 4, N'Sân này xịn nha', CAST(N'2024-11-01T14:25:40.670' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (11, 4, N'myntd', 5, N'Sân tốt lắm nha mọi người', CAST(N'2024-11-22T17:41:02.343' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (13, 2, N'myntd', 5, N'Sân thì đẹp chủ sân thì 6''
', CAST(N'2024-12-03T15:04:05.940' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (15, 2, N'tufpt', 4, N'Chỉ biết ước chứ tiền đâu đặt', CAST(N'2024-12-03T15:05:05.847' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (17, 2, N'phihung', 1, N'Sân tuyệt vời lắmmmmmmmmm!', CAST(N'2024-12-03T16:32:00.020' AS DateTime))
INSERT [dbo].[FieldReviews] ([Field_Review_Id], [Sport_Field_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (19, 10, N'myntd', 3, N'', CAST(N'2024-12-21T15:47:12.950' AS DateTime))
SET IDENTITY_INSERT [dbo].[FieldReviews] OFF
GO
SET IDENTITY_INSERT [dbo].[Gallery] ON 

INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (75, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194714/fgytr6no7uzz9bzwp49h.jpg', 51)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (76, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194716/r846rs7fhjwvphiutcpo.jpg', 51)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (77, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194717/bzmfjrbeay4e5mhk6ls5.jpg', 51)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (78, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196472/uzc3q1xwzzbfq1sfwgsl.jpg', 50)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (79, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196473/o9upp863j03gg9xx3lcn.jpg', 50)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (80, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196475/swzqce7pea0w3lrc2oyj.jpg', 50)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (81, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196476/oyl1ntcnyntmtfuv3k6j.jpg', 50)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (82, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196478/o805rtnxw4gjfryjonyt.jpg', 50)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (83, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733198207/lxajtncpriymbi6hpauo.jpg', 53)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (84, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733198209/hoadsl4q2no80h1jhcwk.jpg', 53)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (85, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733198210/shycvxxaitr9yrxmb6r5.jpg', 53)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (86, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199041/xgfizhktrzauqcy7nydt.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (87, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199042/kuesab66rhnoupd5bvtg.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (88, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199044/oaevvn9jestt0vqgpcy2.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (89, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199045/jfeilyyqel2tgabwzgn3.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (90, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199047/mjbu0atleoqdv5ii1n2j.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (91, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199048/t0cwnfwxgjwwb5yuch7h.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (92, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199050/r7tafnvagasya7rqls6j.jpg', 49)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (93, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199321/uoudqvfyaxheixy2xovr.jpg', 54)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (94, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199323/hpje6kj6diup5dsf47ja.jpg', 54)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (95, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199324/dgreppjun9gwrr7nwthf.jpg', 54)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (96, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199800/iqkwob1rldkxjhtotao3.jpg', 48)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (97, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199802/tmvzgo7evwked3174tx1.jpg', 48)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (98, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199805/f2muvtmmnsrj7ajfv47s.jpg', 48)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (99, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199806/ngbmhto6vij6ndszacmj.jpg', 48)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (100, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200066/o0ofzjqcq0zxkprcauzd.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (101, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200068/qxzi9a5fi3dzaxhmuyhb.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (102, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200070/zyftp7lpyuyjxuneaj5y.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (103, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200072/l3zhecgfe1ycolpfiyqr.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (104, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200074/rmgfspff5datl4uxzbzr.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (105, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200076/brbw2jhfxmblpnjdntt9.jpg', 46)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (106, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200272/nm2y74ga5xvdj1ohx1jv.jpg', 41)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (107, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200277/efwp6qjhopbfbayssro0.jpg', 41)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (108, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200279/egagwpzknb01a3bpwn4w.jpg', 41)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (109, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200281/lcvvi4deezvwupdnnv8b.jpg', 41)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (110, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200438/bxxo6dpyz3pdsequhktk.jpg', 42)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (111, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200439/uglxrgzje16pem40pm6b.jpg', 42)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (112, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200442/pbp730cwh3abdf2brxth.jpg', 42)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (113, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200444/hinkaaywrfmzuei8xegj.jpg', 42)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (114, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200757/psqbhkm4lpvbxlzwhpy0.jpg', 40)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (115, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200759/f1jkuklf1p5gkgnamedm.jpg', 40)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (116, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200762/d4zpftbhsmdt3qjticf1.jpg', 40)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (117, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200888/x6kzigdww3fbtnzxkts5.jpg', 39)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (118, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200890/kwdajtrfh19bbnwno0yl.jpg', 39)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (119, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200893/er41wak2hl5rqwovb0uf.jpg', 39)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (120, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201007/yfj2xubx387w6ocemppx.jpg', 38)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (121, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201009/c2dropzcrusxsos54wwt.jpg', 38)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (122, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201012/okh6uyxycpypogzmttik.jpg', 38)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (123, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201695/umyoetzz3jrdjwvdzlpv.jpg', 31)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (124, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201697/xe23kdqtwzdcmz4vbggx.jpg', 31)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (125, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201699/bh3ay4ljnubwoqgh2gqh.jpg', 31)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (126, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201911/d7vvpopo4e5iixupt6ds.jpg', 35)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (127, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201914/gtqphf4mfzzp8oias3af.jpg', 35)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (128, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201916/x94dkmrf0liecdsaazuh.jpg', 35)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (129, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202263/zw3xbanb37vlwkffczlc.png', 44)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (130, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202265/jr6lxiuwued6q1ns1dfr.png', 44)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (131, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202401/bjgmqj5mylqoml9hqwwg.jpg', 43)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (132, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202550/f0f0ena6uls9nzbgtywi.png', 29)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (133, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202551/xyz8morm0cxncydvn4uz.png', 29)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (134, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202553/ny31wrplqhw6gylyvlje.png', 29)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (135, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202761/jtpaecgssgnvcppbcgnc.jpg', 27)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (136, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202763/pqy1fxqnlool8xw13lhx.jpg', 27)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (137, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202766/gtlxx9iggh4e4imwt3l6.jpg', 27)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (138, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203038/wwagpzufstmupnfsdnez.jpg', 3)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (139, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203040/a6lhngnpr7xsrw0cfxqx.jpg', 3)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (140, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203042/upvdh0zwnisovipaynzk.jpg', 3)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (141, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203463/peadl3dezqx3ownr8utk.jpg', 55)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (142, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203561/mfmagvodsmv6p9ylp6c2.jpg', 56)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (143, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203563/vcmr62sqpvsny8cjs4nf.jpg', 56)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (144, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203565/ppjujt4ue7llhnrweazc.jpg', 56)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (145, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203706/zuq9ke55jufatwqpr3fy.jpg', 57)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (146, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203708/ede3ho6g3trpvdbawksm.jpg', 57)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (147, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203710/ktfh5g8yxdd21hygjsu0.jpg', 57)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (148, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733323042/armh5lkixdmpgcbwfgo5.jpg', 58)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (149, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733323048/omsqsu37ojqu4mwmqw8t.jpg', 58)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (150, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733324032/ng1nzckbbu0yjqbsdikx.jpg', 59)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (151, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733324033/mra2emcyrvhcqpex6rfi.jpg', 59)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (152, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733324035/gwlewefccu0xmrq56sza.jpg', 59)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (153, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733324037/j2yrn3q8vf5jkhh7pmjf.jpg', 59)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (154, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733670563/xjfjnm3gblvzeqafcttn.jpg', 25)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (155, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733670565/krdixckwgkmptkj2thky.jpg', 25)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (156, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733732428/croxnda4vyvsxxyxwogz.jpg', 26)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (157, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733732429/htyciohmnyee9j7tggew.jpg', 26)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (158, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733732431/csdtxb4tf3ygxyd8nufb.jpg', 26)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (159, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734440/pxylalhx3xnw9kp1w2an.webp', 60)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (160, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734442/dtc9hrsvuhv7cpdrjf7o.webp', 60)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (161, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734443/ua6lhkjpgb8vukp4ckmk.webp', 60)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (162, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734752/qqun8wqnp6wvhsxy9gtv.jpg', 61)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (163, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734754/ser04mngwqu8wxb1ibsk.jpg', 61)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (164, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734756/wjbiwkh0kmfdnr7zm71m.jpg', 61)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (165, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733735521/sqifugtai9gz0skvycq7.jpg', 62)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (166, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733735523/xvd84tltyvff1o6kamyx.jpg', 62)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (167, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733735526/flcvkbgljgjcgql08btx.jpg', 62)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (168, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733736072/uinyaeezqtnwdg69omni.jpg', 63)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (169, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733736074/vda3eknnlzxzvh9pb9ur.jpg', 63)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (170, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733736076/nwlhkw0lku6iqntetewm.jpg', 63)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (171, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733738765/af0ssfldnbkruucmbj3e.webp', 64)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (172, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733738767/tl8xoed1sroixeye0mzj.webp', 64)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (173, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733738769/gnpxt3pdd6sv4mk4umpg.webp', 64)
GO
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (174, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754316/vhdaxshbv4wheijhc3lp.jpg', 65)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (175, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754318/sjhsyizyxlofeo6wz4mn.jpg', 65)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (176, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754560/acntc2xbrypt8zpyqo9e.jpg', 66)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (177, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754562/hjqp1nmpuvvwk9kara34.jpg', 66)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (178, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754564/d0x8kom5jae1wqxehwfx.jpg', 66)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (179, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754741/ytojy8w25jux30a0cavz.jpg', 67)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (180, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754744/kbk9vdlmu27xj5ry13sr.jpg', 67)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (181, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754746/llnpttzbhomzndrpk1qo.jpg', 67)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (182, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734159334/evu1qwjswpfaoplm6irc.png', 68)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (183, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734159337/jj0ep5jdzywgsyghcjih.png', 68)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (184, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734159349/ixiyq64jr7ktipnt27p5.png', 68)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (188, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734363409/sgaapcdd6ztnspk9hesj.jpg', 69)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (189, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734363410/ycbnmugccuolndbdwrsk.jpg', 69)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (190, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734363412/fbrx6kxf3i2o0gpr6hlr.jpg', 69)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (191, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734409775/ww38m45hhx140rd6gygv.webp', 70)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (192, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734418239/zddramfupxmuwoymhql0.jpg', 71)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (193, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734418241/ul8nexs6gyeb4uqerxut.jpg', 71)
INSERT [dbo].[Gallery] ([Gallery_Id], [Name], [Product_Detail_Id]) VALUES (194, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734418243/isveao0ae6b3mwpjaty1.jpg', 71)
SET IDENTITY_INSERT [dbo].[Gallery] OFF
GO
SET IDENTITY_INSERT [dbo].[GallerySportField] ON 

INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (3, 4, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1730966650/gz9gbyqso5qnfbq75bux.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (4, 4, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1730966652/nsad1k26lqmq81tfnbfm.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (5, 7, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1731922060/wndbqhhdqcww1k4hbh8y.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (6, 7, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1731922062/raexyuwekmpqim0pm2ym.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (9, 9, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732704857/mkb6htloooox4ekofgt4.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (10, 10, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732864829/hsgsjw312d46cby337is.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (11, 10, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732864831/nospzzcwpfm7my0awuaf.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (12, 10, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732864834/efz98gjefr2jnknfdhtc.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (13, 3, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732866093/qvis35hu4gdojde3plx9.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (14, 11, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734015010/jzxwgdav4w6cthohigga.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (15, 11, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734015015/h71fehqeskvkvdhv1fqr.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (16, 11, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734015017/vd5e6nzrj431pridsqmy.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (17, 12, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734259238/ws1ql8kpzv0yslaiye6l.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (21, 13, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734366699/tnude8mhm2abztfdelkc.jpg')
INSERT [dbo].[GallerySportField] ([Gallery_Sport_Field_Id], [Sport_Field_Id], [Image]) VALUES (22, 13, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734366701/bg1jllna8jwws2venpie.webp')
SET IDENTITY_INSERT [dbo].[GallerySportField] OFF
GO
SET IDENTITY_INSERT [dbo].[Messages] ON 

INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (361, N'107603460251462154012', N'nguyentuakina', N'Sân này giá bao nhiêu vậy sộp', CAST(N'2024-12-02T14:58:39.180' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (362, N'nguyentuakina', N'107603460251462154012', N'sân này giá 1m5 nha em iu', CAST(N'2024-12-02T14:58:50.177' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (363, N'107603460251462154012', N'nguyentuakina', N'đắt quá z em ko đặt đâu', CAST(N'2024-12-02T14:58:59.833' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (364, N'myntd', N'100928486128195800698', N'nói nhiều quá, đau hết cả đầu', CAST(N'2024-12-02T15:48:23.527' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (375, N'nguyentuakina', N'107603460251462154012', N'kệ em', CAST(N'2024-12-03T11:40:16.787' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (382, N'myntd', N'nguyentuakina', N'chào sốp', CAST(N'2024-12-04T17:45:21.453' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (383, N'myntd', N'nguyentuakina', N'sốp cho cảm nhận về web của mình với ạ', CAST(N'2024-12-04T17:48:21.630' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (384, N'nguyentuakina', N'myntd', N'web là cái gì vậy ạ ???', CAST(N'2024-12-04T17:49:12.527' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (385, N'myntd', N'nguyentuakina', N'hả', CAST(N'2024-12-04T17:49:26.343' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (386, N'myntd', N'nguyentuakina', N'Chào bạn', CAST(N'2024-12-04T21:44:59.103' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (389, N'nguyentuakina', N'100928486128195800698', N'hello shop', CAST(N'2024-12-11T15:12:06.397' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (390, N'nguyentuakina', N'myntd', N'mình nghe nè bạn', CAST(N'2024-12-15T13:13:35.220' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (391, N'nguyentuakina', N'myntd', N'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', CAST(N'2024-12-16T14:54:04.313' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (392, N'phihung', N'myntd', N'da chao ad', CAST(N'2024-12-16T18:42:50.333' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (393, N'myntd', N'phihung', N'gì a', CAST(N'2024-12-16T18:42:58.127' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (394, N'myntd', N'nguyentuakina', N'gì vậy trời', CAST(N'2024-12-16T23:36:52.457' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (395, N'nguyentuakina', N'myntd', N'hả', CAST(N'2024-12-16T23:42:18.920' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (396, N'myntd', N'nguyentuakina', N'???', CAST(N'2024-12-16T23:42:38.023' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (397, N'myntd', N'nguyentuakina', N'gì?', CAST(N'2024-12-16T23:42:39.987' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (398, N'nguyentuakina', N'myntd', N'ngon ta', CAST(N'2024-12-16T23:42:47.027' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (399, N'nguyentuakina', N'myntd', N'nhanh ác', CAST(N'2024-12-16T23:42:55.257' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (400, N'myntd', N'nguyentuakina', N'có toast luôn r', CAST(N'2024-12-16T23:42:57.660' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (401, N'myntd', N'nguyentuakina', N'đi ngủ', CAST(N'2024-12-16T23:43:01.060' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (402, N'nguyentuakina', N'myntd', N'xịn xịn', CAST(N'2024-12-16T23:43:03.077' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (403, N'nguyentuakina', N'myntd', N'ngủ thôi', CAST(N'2024-12-16T23:43:04.740' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (404, N'phihung', N'nguyentuakina', N'ad cho xin giá', CAST(N'2024-12-17T11:15:52.740' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (405, N'nguyentuakina', N'phihung', N'giá 2 tỷ nha em', CAST(N'2024-12-17T11:16:08.983' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (406, N'phihung', N'nguyentuakina', N'ngon', CAST(N'2024-12-17T11:16:13.863' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (407, N'nguyentuakina', N'phihung', N'=))', CAST(N'2024-12-17T11:16:19.103' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (408, N'nguyentuakina', N'phihung', N'thế có đặt kh ?', CAST(N'2024-12-17T11:16:26.127' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (409, N'phihung', N'nguyentuakina', N'cho suất 2h', CAST(N'2024-12-17T11:16:32.640' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (410, N'nguyentuakina', N'phihung', N'tự lên đặt đi em', CAST(N'2024-12-17T11:16:37.443' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (411, N'phihung', N'nguyentuakina', N'm thái độ hả?', CAST(N'2024-12-17T11:16:56.443' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (412, N'nguyentuakina', N'phihung', N'ăn band ko', CAST(N'2024-12-17T11:17:27.803' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (413, N'nguyentuakina', N'phihung', N'alo', CAST(N'2024-12-25T00:54:50.563' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (414, N'phihung', N'nguyentuakina', N'alo', CAST(N'2024-12-25T00:55:03.377' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (415, N'nguyentuakina', N'phihung', N'nghe nef ban', CAST(N'2024-12-25T00:55:07.827' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (416, N'phihung', N'nguyentuakina', N'cho minh 1 skin Hutao', CAST(N'2024-12-25T00:55:32.173' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (417, N'nguyentuakina', N'phihung', N'co cai nit', CAST(N'2024-12-25T00:55:48.093' AS DateTime), 0)
INSERT [dbo].[Messages] ([MessageId], [SenderUsername], [ReceiverUsername], [Content], [CreatedAt], [IsDeleted]) VALUES (418, N'nguyentuakina', N'phihung', N'aloooooooo', CAST(N'2025-01-15T19:10:21.083' AS DateTime), 0)
SET IDENTITY_INSERT [dbo].[Messages] OFF
GO
SET IDENTITY_INSERT [dbo].[Notification] ON 

INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (1993, N'nguyentuakinapy', N'Thời hạn gói miễn phí', N'Gói miễn phí còn -26 ngày.', N'subscription', 0, CAST(N'2024-12-13T23:59:53.517' AS DateTime), CAST(N'2024-12-13T23:59:53.517' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (1994, N'nguyentuakinapy', N'Thời hạn gói miễn phí', N'Gói miễn phí còn -27 ngày.', N'subscription', 0, CAST(N'2024-12-14T00:00:00.113' AS DateTime), CAST(N'2024-12-14T00:00:00.113' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (1995, N'nguyentuakinapy', N'Thời hạn gói miễn phí', N'Gói miễn phí còn -27 ngày.', N'subscription', 0, CAST(N'2024-12-14T06:23:40.580' AS DateTime), CAST(N'2024-12-14T06:23:40.580' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (1998, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 15h00 đến 16h00', N'info', 0, CAST(N'2024-12-14T14:30:00.307' AS DateTime), CAST(N'2024-12-14T14:30:00.307' AS DateTime), 759, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2000, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 15h00 đến 16h00', N'info', 0, CAST(N'2024-12-14T14:30:00.393' AS DateTime), CAST(N'2024-12-14T14:30:00.393' AS DateTime), 759, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2002, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-14T15:30:01.290' AS DateTime), CAST(N'2024-12-14T15:30:01.290' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2003, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-14T15:30:01.080' AS DateTime), CAST(N'2024-12-14T15:30:01.080' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2010, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 4 sẽ bắt đầu đá lúc 18h30 đến 20h30', N'info', 0, CAST(N'2024-12-14T18:00:01.490' AS DateTime), CAST(N'2024-12-14T18:00:01.490' AS DateTime), 629, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2011, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 4 sẽ bắt đầu đá lúc 18h30 đến 20h30', N'info', 0, CAST(N'2024-12-14T18:00:01.163' AS DateTime), CAST(N'2024-12-14T18:00:01.163' AS DateTime), 629, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2012, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.250.000 ₫', N'info', 0, CAST(N'2024-12-14T20:26:29.937' AS DateTime), CAST(N'2024-12-14T20:26:29.937' AS DateTime), NULL, 230)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2013, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.250.000 ₫', N'info', 0, CAST(N'2024-12-14T20:26:29.983' AS DateTime), CAST(N'2024-12-14T20:26:29.983' AS DateTime), NULL, 230)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2015, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.250.000 ₫', N'info', 0, CAST(N'2024-12-14T20:26:30.030' AS DateTime), CAST(N'2024-12-14T20:26:30.030' AS DateTime), NULL, 230)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2016, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 1.000.000 ₫', N'info', 0, CAST(N'2024-12-14T20:29:42.450' AS DateTime), CAST(N'2024-12-14T20:29:42.450' AS DateTime), NULL, 231)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2017, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 1.000.000 ₫', N'info', 0, CAST(N'2024-12-14T20:29:42.483' AS DateTime), CAST(N'2024-12-14T20:29:42.483' AS DateTime), NULL, 231)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2019, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 1.000.000 ₫', N'info', 0, CAST(N'2024-12-14T20:29:42.530' AS DateTime), CAST(N'2024-12-14T20:29:42.530' AS DateTime), NULL, 231)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2020, N'nguyentuakinapy', N'Thời hạn gói miễn phí', N'Gói miễn phí còn -28 ngày.', N'subscription', 0, CAST(N'2024-12-15T00:00:00.233' AS DateTime), CAST(N'2024-12-15T00:00:00.233' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2030, N'tupy123', N'Đăng ký gói tài khoản', N'Gói miễn phí đã đăng ký thành công!', N'info', 0, CAST(N'2024-12-15T17:38:50.213' AS DateTime), CAST(N'2024-12-15T17:38:50.213' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2031, N'tupy123', N'Nâng cấp gói tài khoản', N'Gói cơ bản đã nâng cấp thành công!', N'info', 0, CAST(N'2024-12-15T17:43:14.473' AS DateTime), CAST(N'2024-12-15T17:43:14.473' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2033, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 2 sẽ bắt đầu đá lúc 18h30 đến 20h00', N'info', 0, CAST(N'2024-12-15T18:00:02.083' AS DateTime), CAST(N'2024-12-15T18:00:02.083' AS DateTime), 785, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2036, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 2 sẽ bắt đầu đá lúc 18h30 đến 20h00', N'info', 0, CAST(N'2024-12-15T18:00:01.320' AS DateTime), CAST(N'2024-12-15T18:00:01.320' AS DateTime), 785, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2038, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 2 sẽ bắt đầu đá lúc 18h30 đến 20h00', N'info', 0, CAST(N'2024-12-15T18:00:01.960' AS DateTime), CAST(N'2024-12-15T18:00:01.960' AS DateTime), 785, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2039, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 2 sẽ bắt đầu đá lúc 18h30 đến 20h00', N'info', 0, CAST(N'2024-12-15T18:00:11.523' AS DateTime), CAST(N'2024-12-15T18:00:11.523' AS DateTime), 785, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2040, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 21h00', N'info', 0, CAST(N'2024-12-15T18:30:02.750' AS DateTime), CAST(N'2024-12-15T18:30:02.750' AS DateTime), 794, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2041, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 21h00', N'info', 0, CAST(N'2024-12-15T18:30:06.333' AS DateTime), CAST(N'2024-12-15T18:30:06.333' AS DateTime), 794, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2042, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 21h00', N'info', 0, CAST(N'2024-12-15T18:30:06.437' AS DateTime), CAST(N'2024-12-15T18:30:06.437' AS DateTime), 794, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2043, N'tupy123', N'Khu vực Sân bóng Phú Yên', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 21h00', N'info', 0, CAST(N'2024-12-15T18:30:15.290' AS DateTime), CAST(N'2024-12-15T18:30:15.290' AS DateTime), 794, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2044, N'myntd', N'Đặt sân mới', N'Nguyễn Phi Hùng Vừa đặt sân.', N'info', 0, CAST(N'2024-12-15T18:46:25.883' AS DateTime), CAST(N'2024-12-15T18:46:25.883' AS DateTime), 797, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2045, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 671.634 ₫', N'info', 0, CAST(N'2024-12-15T19:12:34.890' AS DateTime), CAST(N'2024-12-15T19:12:34.890' AS DateTime), NULL, 232)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2046, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 671.634 ₫', N'info', 0, CAST(N'2024-12-15T19:12:35.070' AS DateTime), CAST(N'2024-12-15T19:12:35.070' AS DateTime), NULL, 232)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2048, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 671.634 ₫', N'info', 0, CAST(N'2024-12-15T19:12:35.393' AS DateTime), CAST(N'2024-12-15T19:12:35.393' AS DateTime), NULL, 232)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2049, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 735.000 ₫', N'info', 0, CAST(N'2024-12-15T19:17:19.223' AS DateTime), CAST(N'2024-12-15T19:17:19.223' AS DateTime), NULL, 233)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2050, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 735.000 ₫', N'info', 0, CAST(N'2024-12-15T19:17:19.387' AS DateTime), CAST(N'2024-12-15T19:17:19.387' AS DateTime), NULL, 233)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2052, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 735.000 ₫', N'info', 0, CAST(N'2024-12-15T19:17:19.660' AS DateTime), CAST(N'2024-12-15T19:17:19.660' AS DateTime), NULL, 233)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2053, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:28:51.723' AS DateTime), CAST(N'2024-12-15T19:28:51.723' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2054, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:28:51.923' AS DateTime), CAST(N'2024-12-15T19:28:51.923' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2056, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:28:52.193' AS DateTime), CAST(N'2024-12-15T19:28:52.193' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2057, N'nhanvien', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:34:01.730' AS DateTime), CAST(N'2024-12-15T19:34:01.730' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2058, N'myntd', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:34:01.860' AS DateTime), CAST(N'2024-12-15T19:34:01.860' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2060, N'100928486128195800698', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 6.490.000 ₫', N'info', 0, CAST(N'2024-12-15T19:34:02.157' AS DateTime), CAST(N'2024-12-15T19:34:02.157' AS DateTime), NULL, 234)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2061, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:40:27.660' AS DateTime), CAST(N'2024-12-15T19:40:27.660' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2062, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:40:27.703' AS DateTime), CAST(N'2024-12-15T19:40:27.703' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2064, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Phi Hùng đã mua sản phẩm mới giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:40:27.760' AS DateTime), CAST(N'2024-12-15T19:40:27.760' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2065, N'nhanvien', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:41:17.907' AS DateTime), CAST(N'2024-12-15T19:41:17.907' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2066, N'myntd', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:41:17.960' AS DateTime), CAST(N'2024-12-15T19:41:17.960' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2068, N'100928486128195800698', N'Có đơn hàng vừa hủy!', N'Nguyễn Phi Hùng đã hủy đơn hàng giá: 725.000 ₫', N'info', 0, CAST(N'2024-12-15T19:41:18.050' AS DateTime), CAST(N'2024-12-15T19:41:18.050' AS DateTime), NULL, 235)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2069, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T22:52:56.600' AS DateTime), CAST(N'2024-12-15T22:52:56.600' AS DateTime), NULL, 236)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2070, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T22:52:56.640' AS DateTime), CAST(N'2024-12-15T22:52:56.640' AS DateTime), NULL, 236)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2072, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T22:52:56.687' AS DateTime), CAST(N'2024-12-15T22:52:56.687' AS DateTime), NULL, 236)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2073, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 3.150.000 ₫', N'info', 0, CAST(N'2024-12-15T22:54:00.397' AS DateTime), CAST(N'2024-12-15T22:54:00.397' AS DateTime), NULL, 237)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2074, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 3.150.000 ₫', N'info', 0, CAST(N'2024-12-15T22:54:00.430' AS DateTime), CAST(N'2024-12-15T22:54:00.430' AS DateTime), NULL, 237)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2076, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 3.150.000 ₫', N'info', 0, CAST(N'2024-12-15T22:54:00.473' AS DateTime), CAST(N'2024-12-15T22:54:00.473' AS DateTime), NULL, 237)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2077, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T23:00:02.687' AS DateTime), CAST(N'2024-12-15T23:00:02.687' AS DateTime), NULL, 238)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2078, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T23:00:02.737' AS DateTime), CAST(N'2024-12-15T23:00:02.737' AS DateTime), NULL, 238)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2080, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 2.390.000 ₫', N'info', 0, CAST(N'2024-12-15T23:00:02.783' AS DateTime), CAST(N'2024-12-15T23:00:02.783' AS DateTime), NULL, 238)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2081, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 500.000 ₫', N'info', 0, CAST(N'2024-12-15T23:01:42.767' AS DateTime), CAST(N'2024-12-15T23:01:42.767' AS DateTime), NULL, 239)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2082, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 500.000 ₫', N'info', 0, CAST(N'2024-12-15T23:01:42.810' AS DateTime), CAST(N'2024-12-15T23:01:42.810' AS DateTime), NULL, 239)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2084, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Hoàng Hữu Thành đã mua sản phẩm mới giá: 500.000 ₫', N'info', 0, CAST(N'2024-12-15T23:01:42.857' AS DateTime), CAST(N'2024-12-15T23:01:42.857' AS DateTime), NULL, 239)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2085, N'nguyentuakinapy', N'Thời hạn gói miễn phí', N'Gói miễn phí còn -29 ngày.', N'subscription', 0, CAST(N'2024-12-16T00:00:00.167' AS DateTime), CAST(N'2024-12-16T00:00:00.167' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2087, N'100928486128195800698', N'Khu vực Sân Bóng Đá Phủi Sài Gòn', N'Phủi  1 sẽ bắt đầu đá lúc 8h00 đến 9h30', N'info', 0, CAST(N'2024-12-16T07:30:00.467' AS DateTime), CAST(N'2024-12-16T07:30:00.467' AS DateTime), 770, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2093, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-16T15:30:00.580' AS DateTime), CAST(N'2024-12-16T15:30:00.580' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2094, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-16T15:30:00.847' AS DateTime), CAST(N'2024-12-16T15:30:00.847' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2095, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-16T15:30:00.400' AS DateTime), CAST(N'2024-12-16T15:30:00.400' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2096, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-16T15:30:00.170' AS DateTime), CAST(N'2024-12-16T15:30:00.170' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2097, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa ', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-16T15:30:02.413' AS DateTime), CAST(N'2024-12-16T15:30:02.413' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2098, N'tuakinapy', N'Đăng ký gói tài khoản', N'Gói miễn phí đã đăng ký thành công!', N'info', 1, CAST(N'2024-12-16T18:05:13.947' AS DateTime), CAST(N'2024-12-16T18:05:13.947' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2099, N'tuakinapy', N'Nâng cấp gói tài khoản', N'Gói cơ bản đã nâng cấp thành công!', N'info', 1, CAST(N'2024-12-16T18:13:39.710' AS DateTime), CAST(N'2024-12-16T18:13:39.710' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2100, N'myntd', N'Đặt sân mới', N'Nguyễn Phi Hùng Vừa đặt sân.', N'info', 0, CAST(N'2024-12-16T18:16:47.943' AS DateTime), CAST(N'2024-12-16T18:16:47.943' AS DateTime), 804, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2101, N'tuakinapy', N'Khu vực Sân Tú Thứ 2', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 22h00', N'info', 0, CAST(N'2024-12-16T18:30:03.393' AS DateTime), CAST(N'2024-12-16T18:30:03.393' AS DateTime), 801, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2102, N'tuakinapy', N'Khu vực Sân Tú Thứ 2', N'Sân 1 sẽ bắt đầu đá lúc 19h00 đến 22h00', N'info', 0, CAST(N'2024-12-16T18:30:01.930' AS DateTime), CAST(N'2024-12-16T18:30:01.930' AS DateTime), 801, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2103, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Thanh Trúc đã mua sản phẩm mới giá: 2.160.100 ₫', N'info', 0, CAST(N'2024-12-16T18:32:48.783' AS DateTime), CAST(N'2024-12-16T18:32:48.783' AS DateTime), NULL, 240)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2104, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Thanh Trúc đã mua sản phẩm mới giá: 2.160.100 ₫', N'info', 0, CAST(N'2024-12-16T18:32:48.817' AS DateTime), CAST(N'2024-12-16T18:32:48.817' AS DateTime), NULL, 240)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2106, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Thanh Trúc đã mua sản phẩm mới giá: 2.160.100 ₫', N'info', 0, CAST(N'2024-12-16T18:32:48.873' AS DateTime), CAST(N'2024-12-16T18:32:48.873' AS DateTime), NULL, 240)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2108, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-myntd', N'Nguyễn Thị Diệu Mỵ vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-16T18:42:58.240' AS DateTime), CAST(N'2024-12-16T18:42:58.240' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2109, N'100928486128195800698', N'Đặt sân mới', N'Nguyễn Tú Akina Vừa đặt sân.', N'info', 0, CAST(N'2024-12-16T23:28:19.377' AS DateTime), CAST(N'2024-12-16T23:28:19.377' AS DateTime), 805, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2120, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 8.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:08.493' AS DateTime), CAST(N'2024-12-17T00:05:08.493' AS DateTime), NULL, 241)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2121, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 8.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:08.520' AS DateTime), CAST(N'2024-12-17T00:05:08.520' AS DateTime), NULL, 241)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2123, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 8.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:08.540' AS DateTime), CAST(N'2024-12-17T00:05:08.540' AS DateTime), NULL, 241)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2124, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 600.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:51.953' AS DateTime), CAST(N'2024-12-17T00:05:51.953' AS DateTime), NULL, 242)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2125, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 600.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:51.970' AS DateTime), CAST(N'2024-12-17T00:05:51.970' AS DateTime), NULL, 242)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2127, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 600.000 ₫', N'info', 0, CAST(N'2024-12-17T00:05:51.987' AS DateTime), CAST(N'2024-12-17T00:05:51.987' AS DateTime), NULL, 242)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2128, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.230.000 ₫', N'info', 0, CAST(N'2024-12-17T00:15:57.223' AS DateTime), CAST(N'2024-12-17T00:15:57.223' AS DateTime), NULL, 243)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2129, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.230.000 ₫', N'info', 0, CAST(N'2024-12-17T00:15:57.260' AS DateTime), CAST(N'2024-12-17T00:15:57.260' AS DateTime), NULL, 243)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2131, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.230.000 ₫', N'info', 0, CAST(N'2024-12-17T00:15:57.313' AS DateTime), CAST(N'2024-12-17T00:15:57.313' AS DateTime), NULL, 243)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2132, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 4.699.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:17.670' AS DateTime), CAST(N'2024-12-17T00:16:17.670' AS DateTime), NULL, 244)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2133, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 4.699.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:17.703' AS DateTime), CAST(N'2024-12-17T00:16:17.703' AS DateTime), NULL, 244)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2135, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 4.699.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:17.760' AS DateTime), CAST(N'2024-12-17T00:16:17.760' AS DateTime), NULL, 244)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2136, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:28.170' AS DateTime), CAST(N'2024-12-17T00:16:28.170' AS DateTime), NULL, 245)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2137, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:28.200' AS DateTime), CAST(N'2024-12-17T00:16:28.200' AS DateTime), NULL, 245)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2139, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Võ Tấn Thành đã mua sản phẩm mới giá: 1.690.000 ₫', N'info', 0, CAST(N'2024-12-17T00:16:28.237' AS DateTime), CAST(N'2024-12-17T00:16:28.237' AS DateTime), NULL, 245)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2140, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 190.000 ₫', N'info', 0, CAST(N'2024-12-17T00:53:17.563' AS DateTime), CAST(N'2024-12-17T00:53:17.563' AS DateTime), NULL, 246)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2141, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 190.000 ₫', N'info', 0, CAST(N'2024-12-17T00:53:17.610' AS DateTime), CAST(N'2024-12-17T00:53:17.610' AS DateTime), NULL, 246)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2143, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 190.000 ₫', N'info', 0, CAST(N'2024-12-17T00:53:17.693' AS DateTime), CAST(N'2024-12-17T00:53:17.693' AS DateTime), NULL, 246)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2144, N'myntd', N'Đặt sân mới', N'Nguyễn Tú Akina Vừa đặt sân.', N'info', 0, CAST(N'2024-12-17T00:54:07.260' AS DateTime), CAST(N'2024-12-17T00:54:07.260' AS DateTime), 813, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2145, N'myntd', N'Đặt sân mới', N'Nguyễn Tú Akina Vừa đặt sân.', N'info', 0, CAST(N'2024-12-17T00:55:05.190' AS DateTime), CAST(N'2024-12-17T00:55:05.190' AS DateTime), 814, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2148, N'myntd', N'Khu vực SÂN BÓNG ĐÁ MINI K345', N'Sân 1 sẽ bắt đầu đá lúc 6h30 đến 8h00', N'info', 0, CAST(N'2024-12-17T06:00:00.487' AS DateTime), CAST(N'2024-12-17T06:00:00.487' AS DateTime), 813, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2153, N'tuakinapy', N'Khu vực Sân Tú Thứ 2', N'Sân 1 sẽ bắt đầu đá lúc 9h00 đến 12h00', N'info', 0, CAST(N'2024-12-17T08:30:07.030' AS DateTime), CAST(N'2024-12-17T08:30:07.030' AS DateTime), 802, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2157, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-17T11:16:09.060' AS DateTime), CAST(N'2024-12-17T11:16:09.060' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2159, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-17T11:16:19.197' AS DateTime), CAST(N'2024-12-17T11:16:19.197' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2160, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-17T11:16:26.203' AS DateTime), CAST(N'2024-12-17T11:16:26.203' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2162, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-17T11:16:37.533' AS DateTime), CAST(N'2024-12-17T11:16:37.533' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2164, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 1, CAST(N'2024-12-17T11:17:27.880' AS DateTime), CAST(N'2024-12-17T11:17:27.880' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2166, N'myntd', N'Nâng cấp gói tài khoản', N'Gói nâng cao đã nâng cấp thành công!', N'info', 0, CAST(N'2024-12-17T11:39:58.240' AS DateTime), CAST(N'2024-12-17T11:39:58.240' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2174, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:35:55.663' AS DateTime), CAST(N'2024-12-17T13:35:55.663' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2175, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:35:55.717' AS DateTime), CAST(N'2024-12-17T13:35:55.717' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2177, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Tú Akina đã mua sản phẩm mới giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:35:55.787' AS DateTime), CAST(N'2024-12-17T13:35:55.787' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2178, N'nhanvien', N'Có đơn hàng vừa hủy!', N'Nguyễn Tú Akina đã hủy đơn hàng giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:37:22.140' AS DateTime), CAST(N'2024-12-17T13:37:22.140' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2179, N'myntd', N'Có đơn hàng vừa hủy!', N'Nguyễn Tú Akina đã hủy đơn hàng giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:37:22.183' AS DateTime), CAST(N'2024-12-17T13:37:22.183' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2181, N'100928486128195800698', N'Có đơn hàng vừa hủy!', N'Nguyễn Tú Akina đã hủy đơn hàng giá: 2.360.000 ₫', N'info', 0, CAST(N'2024-12-17T13:37:22.237' AS DateTime), CAST(N'2024-12-17T13:37:22.237' AS DateTime), NULL, 247)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2182, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 15h00 đến 16h00', N'info', 0, CAST(N'2024-12-17T14:30:02.410' AS DateTime), CAST(N'2024-12-17T14:30:02.410' AS DateTime), 759, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2186, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 17h30 đến 19h30', N'info', 0, CAST(N'2024-12-17T17:00:01.973' AS DateTime), CAST(N'2024-12-17T17:00:01.973' AS DateTime), 797, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2190, N'nguyentuakinapy', N'Khu vực Sân của Thanh Tú', N'Sân 1 sẽ bắt đầu đá lúc 7h00 đến 8h00', N'info', 0, CAST(N'2024-12-18T06:30:00.440' AS DateTime), CAST(N'2024-12-18T06:30:00.440' AS DateTime), 760, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2191, N'100928486128195800698', N'Khu vực SÂN BÓNG ĐÁ MINI CỎ NHÂN TẠO NGÂN VŨ', N'Sân 1 sẽ bắt đầu đá lúc 7h00 đến 9h00', N'info', 0, CAST(N'2024-12-18T06:30:00.630' AS DateTime), CAST(N'2024-12-18T06:30:00.630' AS DateTime), 805, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2197, N'100928486128195800698', N'Khu vực Sân Bóng Đá Phủi Sài Gòn', N'Phủi  1 sẽ bắt đầu đá lúc 16h00 đến 17h00', N'info', 0, CAST(N'2024-12-18T15:30:02.983' AS DateTime), CAST(N'2024-12-18T15:30:02.983' AS DateTime), 758, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2198, N'myntd', N'Khu vực SÂN BÓNG ĐÁ MINI K345', N'Sân 1 sẽ bắt đầu đá lúc 7h30 đến 9h30', N'info', 0, CAST(N'2024-12-19T07:00:01.280' AS DateTime), CAST(N'2024-12-19T07:00:01.280' AS DateTime), 814, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2200, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 15h00 đến 16h00', N'info', 0, CAST(N'2024-12-19T14:30:02.350' AS DateTime), CAST(N'2024-12-19T14:30:02.350' AS DateTime), 759, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2201, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-19T15:30:02.183' AS DateTime), CAST(N'2024-12-19T15:30:02.183' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2202, N'100928486128195800698', N'Khu vực Sân Bóng Đá Phủi Sài Gòn', N'Phủi  1 sẽ bắt đầu đá lúc 16h00 đến 17h00', N'info', 0, CAST(N'2024-12-19T15:30:02.593' AS DateTime), CAST(N'2024-12-19T15:30:02.593' AS DateTime), 758, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2203, N'nguyentuakinapy', N'Khu vực Sân của Thanh Tú', N'Sân 1 sẽ bắt đầu đá lúc 7h00 đến 8h00', N'info', 0, CAST(N'2024-12-20T06:30:00.450' AS DateTime), CAST(N'2024-12-20T06:30:00.450' AS DateTime), 760, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2206, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 15h00 đến 16h00', N'info', 0, CAST(N'2024-12-21T14:30:00.320' AS DateTime), CAST(N'2024-12-21T14:30:00.320' AS DateTime), 759, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2207, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-21T15:30:01.557' AS DateTime), CAST(N'2024-12-21T15:30:01.557' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2208, N'nhanvien', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:24.253' AS DateTime), CAST(N'2024-12-21T15:48:24.253' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2209, N'myntd', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:24.267' AS DateTime), CAST(N'2024-12-21T15:48:24.267' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2211, N'100928486128195800698', N'Bạn vừa có đơn hàng mới!', N'Nguyễn Thị Diệu Mỵ đã mua sản phẩm mới giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:24.283' AS DateTime), CAST(N'2024-12-21T15:48:24.283' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2212, N'nhanvien', N'Có đơn hàng vừa hủy!', N'Nguyễn Thị Diệu Mỵ đã hủy đơn hàng giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:40.987' AS DateTime), CAST(N'2024-12-21T15:48:40.987' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2213, N'myntd', N'Có đơn hàng vừa hủy!', N'Nguyễn Thị Diệu Mỵ đã hủy đơn hàng giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:41.003' AS DateTime), CAST(N'2024-12-21T15:48:41.003' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2215, N'100928486128195800698', N'Có đơn hàng vừa hủy!', N'Nguyễn Thị Diệu Mỵ đã hủy đơn hàng giá: 9.660.000 ₫', N'info', 0, CAST(N'2024-12-21T15:48:41.020' AS DateTime), CAST(N'2024-12-21T15:48:41.020' AS DateTime), NULL, 248)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2217, N'myntd', N'Khu vực Sân bóng đá mini Chảo Lửa 1', N'Sân 1 sẽ bắt đầu đá lúc 16h00 đến 17h30', N'info', 0, CAST(N'2024-12-23T15:30:00.290' AS DateTime), CAST(N'2024-12-23T15:30:00.290' AS DateTime), 761, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2218, N'nguyentuakina123', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 5 ngày.', N'subscription', 0, CAST(N'2024-12-25T00:00:00.250' AS DateTime), CAST(N'2024-12-25T00:00:00.250' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2219, N'100928486128195800698', N'Thời hạn gói cơ bản 1', N'Gói cơ bản 1 còn 5 ngày.', N'subscription', 0, CAST(N'2024-12-25T00:00:04.190' AS DateTime), CAST(N'2024-12-25T00:00:04.190' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2220, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-25T00:54:50.593' AS DateTime), CAST(N'2024-12-25T00:54:50.593' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2222, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-25T00:55:07.843' AS DateTime), CAST(N'2024-12-25T00:55:07.843' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2224, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2024-12-25T00:55:48.140' AS DateTime), CAST(N'2024-12-25T00:55:48.140' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2225, N'nguyentuakina123', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 4 ngày.', N'subscription', 0, CAST(N'2024-12-26T00:00:00.210' AS DateTime), CAST(N'2024-12-26T00:00:00.210' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2226, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 4 ngày.', N'subscription', 0, CAST(N'2024-12-26T00:00:04.110' AS DateTime), CAST(N'2024-12-26T00:00:04.110' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2227, N'nguyentuakina123', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 3 ngày.', N'subscription', 0, CAST(N'2024-12-27T00:00:00.267' AS DateTime), CAST(N'2024-12-27T00:00:00.267' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2228, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 3 ngày.', N'subscription', 0, CAST(N'2024-12-27T00:00:04.150' AS DateTime), CAST(N'2024-12-27T00:00:04.150' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2229, N'nguyentuakina', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 5 ngày.', N'subscription', 0, CAST(N'2024-12-28T00:00:00.190' AS DateTime), CAST(N'2024-12-28T00:00:00.190' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2230, N'nguyentuakina123', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 2 ngày.', N'subscription', 0, CAST(N'2024-12-28T00:00:03.967' AS DateTime), CAST(N'2024-12-28T00:00:03.967' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2231, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2024-12-28T00:00:07.350' AS DateTime), CAST(N'2024-12-28T00:00:07.350' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2232, N'chusan', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 5 ngày.', N'subscription', 0, CAST(N'2024-12-28T00:00:10.513' AS DateTime), CAST(N'2024-12-28T00:00:10.513' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2233, N'116043414437118260556', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 5 ngày.', N'subscription', 0, CAST(N'2024-12-28T00:00:14.323' AS DateTime), CAST(N'2024-12-28T00:00:14.323' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2234, N'nguyentuakina', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 4 ngày.', N'subscription', 0, CAST(N'2024-12-29T00:00:00.187' AS DateTime), CAST(N'2024-12-29T00:00:00.187' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2235, N'nguyentuakina123', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 1 ngày.', N'subscription', 0, CAST(N'2024-12-29T00:00:03.903' AS DateTime), CAST(N'2024-12-29T00:00:03.903' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2236, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 1 ngày.', N'subscription', 0, CAST(N'2024-12-29T00:00:07.790' AS DateTime), CAST(N'2024-12-29T00:00:07.790' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2237, N'chusan', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 4 ngày.', N'subscription', 0, CAST(N'2024-12-29T00:00:11.053' AS DateTime), CAST(N'2024-12-29T00:00:11.053' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2238, N'116043414437118260556', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 4 ngày.', N'subscription', 0, CAST(N'2024-12-29T00:00:14.587' AS DateTime), CAST(N'2024-12-29T00:00:14.587' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2239, N'nguyentuakina', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 3 ngày.', N'subscription', 0, CAST(N'2024-12-30T00:00:00.197' AS DateTime), CAST(N'2024-12-30T00:00:00.197' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2240, N'nguyentuakina', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2024-12-31T00:00:00.153' AS DateTime), CAST(N'2024-12-31T00:00:00.153' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2241, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -1 ngày.', N'subscription', 0, CAST(N'2024-12-31T00:00:04.690' AS DateTime), CAST(N'2024-12-31T00:00:04.690' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2242, N'chusan', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2024-12-31T00:00:08.367' AS DateTime), CAST(N'2024-12-31T00:00:08.367' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2243, N'116043414437118260556', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 2 ngày.', N'subscription', 0, CAST(N'2024-12-31T00:00:11.773' AS DateTime), CAST(N'2024-12-31T00:00:11.773' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2244, N'nguyentuakina', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-01T00:00:00.230' AS DateTime), CAST(N'2025-01-01T00:00:00.230' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2245, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -1 ngày.', N'subscription', 0, CAST(N'2025-01-01T00:00:03.897' AS DateTime), CAST(N'2025-01-01T00:00:03.897' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2246, N'chusan', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-01T00:00:07.157' AS DateTime), CAST(N'2025-01-01T00:00:07.157' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2247, N'116043414437118260556', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-01T00:00:10.233' AS DateTime), CAST(N'2025-01-01T00:00:10.233' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2248, N'nguyentuakina', N'Gói miễn phí đã hết hạn!', N'Gói miễn phí đã hết hạn, gói đã quay về gói miễn phí!', N'subscription', 0, CAST(N'2025-01-02T00:00:01.557' AS DateTime), CAST(N'2025-01-02T00:00:01.557' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2249, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -3 ngày.', N'subscription', 0, CAST(N'2025-01-02T00:00:05.280' AS DateTime), CAST(N'2025-01-02T00:00:05.280' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2250, N'chusan', N'Gói miễn phí đã hết hạn!', N'Gói miễn phí đã hết hạn, gói đã quay về gói miễn phí!', N'subscription', 0, CAST(N'2025-01-02T00:00:08.713' AS DateTime), CAST(N'2025-01-02T00:00:08.713' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2251, N'116043414437118260556', N'Gói miễn phí đã hết hạn!', N'Gói miễn phí đã hết hạn, gói đã quay về gói miễn phí!', N'subscription', 0, CAST(N'2025-01-02T00:00:12.710' AS DateTime), CAST(N'2025-01-02T00:00:12.710' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2252, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -4 ngày.', N'subscription', 0, CAST(N'2025-01-03T00:00:00.183' AS DateTime), CAST(N'2025-01-03T00:00:00.183' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2253, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -5 ngày.', N'subscription', 0, CAST(N'2025-01-04T00:00:00.260' AS DateTime), CAST(N'2025-01-04T00:00:00.260' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2254, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -6 ngày.', N'subscription', 0, CAST(N'2025-01-05T00:00:00.160' AS DateTime), CAST(N'2025-01-05T00:00:00.160' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2255, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -7 ngày.', N'subscription', 0, CAST(N'2025-01-06T00:00:00.213' AS DateTime), CAST(N'2025-01-06T00:00:00.213' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2256, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -9 ngày.', N'subscription', 0, CAST(N'2025-01-08T00:00:00.180' AS DateTime), CAST(N'2025-01-08T00:00:00.180' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2257, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -10 ngày.', N'subscription', 0, CAST(N'2025-01-09T00:00:00.173' AS DateTime), CAST(N'2025-01-09T00:00:00.173' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2258, N'tupy123', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 5 ngày.', N'subscription', 0, CAST(N'2025-01-09T00:00:04.623' AS DateTime), CAST(N'2025-01-09T00:00:04.623' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2259, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -11 ngày.', N'subscription', 0, CAST(N'2025-01-10T00:00:00.250' AS DateTime), CAST(N'2025-01-10T00:00:00.250' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2260, N'tupy123', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 4 ngày.', N'subscription', 0, CAST(N'2025-01-10T00:00:04.137' AS DateTime), CAST(N'2025-01-10T00:00:04.137' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2261, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 5 ngày.', N'subscription', 0, CAST(N'2025-01-10T00:00:07.350' AS DateTime), CAST(N'2025-01-10T00:00:07.350' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2262, N'myntd', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 5 ngày.', N'subscription', 0, CAST(N'2025-01-11T00:00:00.193' AS DateTime), CAST(N'2025-01-11T00:00:00.193' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2263, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -12 ngày.', N'subscription', 0, CAST(N'2025-01-11T00:00:04.277' AS DateTime), CAST(N'2025-01-11T00:00:04.277' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2264, N'tupy123', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 3 ngày.', N'subscription', 0, CAST(N'2025-01-11T00:00:08.067' AS DateTime), CAST(N'2025-01-11T00:00:08.067' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2265, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 4 ngày.', N'subscription', 0, CAST(N'2025-01-11T00:00:11.687' AS DateTime), CAST(N'2025-01-11T00:00:11.687' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2266, N'myntd', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 4 ngày.', N'subscription', 0, CAST(N'2025-01-12T00:00:00.203' AS DateTime), CAST(N'2025-01-12T00:00:00.203' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2267, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -13 ngày.', N'subscription', 0, CAST(N'2025-01-12T00:00:04.100' AS DateTime), CAST(N'2025-01-12T00:00:04.100' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2268, N'tupy123', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-12T00:00:07.623' AS DateTime), CAST(N'2025-01-12T00:00:07.623' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2269, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 3 ngày.', N'subscription', 0, CAST(N'2025-01-12T00:00:10.987' AS DateTime), CAST(N'2025-01-12T00:00:10.987' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2270, N'myntd', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 3 ngày.', N'subscription', 0, CAST(N'2025-01-13T00:00:00.300' AS DateTime), CAST(N'2025-01-13T00:00:00.300' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2271, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -14 ngày.', N'subscription', 0, CAST(N'2025-01-13T00:00:05.247' AS DateTime), CAST(N'2025-01-13T00:00:05.247' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2272, N'tupy123', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 1 ngày.', N'subscription', 0, CAST(N'2025-01-13T00:00:08.610' AS DateTime), CAST(N'2025-01-13T00:00:08.610' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2273, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-13T00:00:11.763' AS DateTime), CAST(N'2025-01-13T00:00:11.763' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2274, N'myntd', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-14T00:00:00.183' AS DateTime), CAST(N'2025-01-14T00:00:00.183' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2275, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -15 ngày.', N'subscription', 0, CAST(N'2025-01-14T00:00:04.040' AS DateTime), CAST(N'2025-01-14T00:00:04.040' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2276, N'tupy123', N'Gói miễn phí đã hết hạn!', N'Gói miễn phí đã hết hạn, gói đã quay về gói miễn phí!', N'subscription', 0, CAST(N'2025-01-14T00:00:08.553' AS DateTime), CAST(N'2025-01-14T00:00:08.553' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2277, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 1 ngày.', N'subscription', 0, CAST(N'2025-01-14T00:00:11.697' AS DateTime), CAST(N'2025-01-14T00:00:11.697' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2278, N'myntd', N'Thời hạn gói nâng cao', N'Gói nâng cao còn 2 ngày.', N'subscription', 0, CAST(N'2025-01-15T00:00:00.187' AS DateTime), CAST(N'2025-01-15T00:00:00.187' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2279, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -15 ngày.', N'subscription', 0, CAST(N'2025-01-15T00:00:04.040' AS DateTime), CAST(N'2025-01-15T00:00:04.040' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2280, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn 1 ngày.', N'subscription', 0, CAST(N'2025-01-15T00:00:07.740' AS DateTime), CAST(N'2025-01-15T00:00:07.740' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2281, N'phihung', N'Thông báo tin nhắn mới từ/SENDER-nguyentuakina', N'Nguyễn Tú Akina vừa gửi tin cho bạn', N'notifyMess', 0, CAST(N'2025-01-15T19:10:21.100' AS DateTime), CAST(N'2025-01-15T19:10:21.100' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2282, N'myntd', N'Gói miễn phí đã hết hạn!', N'Gói miễn phí đã hết hạn, gói đã quay về gói miễn phí!', N'subscription', 0, CAST(N'2025-01-16T00:00:01.750' AS DateTime), CAST(N'2025-01-16T00:00:01.750' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2283, N'100928486128195800698', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -17 ngày.', N'subscription', 0, CAST(N'2025-01-16T00:00:05.567' AS DateTime), CAST(N'2025-01-16T00:00:05.567' AS DateTime), NULL, NULL)
INSERT [dbo].[Notification] ([Notification_Id], [Username], [Title], [Message], [Type], [Is_Read], [Created_At], [Updated_At], [Booking_Id], [Order_Id]) VALUES (2284, N'tuakinapy', N'Thời hạn gói cơ bản', N'Gói cơ bản còn -1 ngày.', N'subscription', 0, CAST(N'2025-01-16T00:00:08.890' AS DateTime), CAST(N'2025-01-16T00:00:08.890' AS DateTime), NULL, NULL)
SET IDENTITY_INSERT [dbo].[Notification] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderDetails] ON 

INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (64, 4, 3, 66)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (65, 8, 1, 66)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (66, 4, 3, 67)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (67, 24, 3, 67)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (68, 4, 3, 68)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (69, 24, 3, 68)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (70, 4, 3, 69)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (71, 4, 3, 70)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (72, 4, 3, 71)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (73, 24, 3, 71)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (74, 4, 3, 72)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (75, 24, 3, 72)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (76, 24, 3, 73)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (77, 4, 1, 74)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (78, 24, 2, 75)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (79, 24, 2, 76)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (80, 23, 5, 77)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (81, 8, 4, 77)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (82, 24, 1, 77)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (83, 23, 5, 78)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (84, 23, 5, 79)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (85, 23, 5, 80)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (86, 24, 1, 81)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (87, 8, 1, 82)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (88, 26, 1, 83)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (89, 26, 1, 84)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (90, 26, 1, 85)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (92, 26, 2, 87)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (93, 26, 1, 88)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (94, 26, 1, 89)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (95, 25, 1, 90)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (96, 26, 1, 91)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (97, 26, 2, 92)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (98, 24, 1, 93)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (99, 25, 2, 94)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (100, 26, 2, 95)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (101, 24, 3, 96)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (102, 24, 3, 98)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (103, 24, 4, 103)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (104, 24, 4, 108)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (105, 27, 1, 115)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (106, 27, 1, 116)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (107, 27, 1, 117)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (108, 27, 1, 118)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (109, 27, 1, 119)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (110, 27, 1, 120)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (111, 27, 1, 121)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (112, 27, 1, 122)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (113, 27, 2, 124)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (114, 27, 2, 125)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (115, 23, 3, 128)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (116, 25, 2, 129)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (117, 23, 3, 130)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (118, 60, 1, 133)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (119, 60, 1, 134)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (120, 60, 1, 135)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (121, 62, 1, 136)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (122, 44, 3, 136)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (123, 62, 1, 137)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (124, 44, 3, 137)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (125, 27, 2, 141)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (126, 25, 1, 144)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (127, 27, 1, 144)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (128, 26, 3, 145)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (129, 25, 2, 145)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (130, 27, 1, 145)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (131, 26, 3, 146)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (132, 25, 2, 146)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (133, 27, 1, 146)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (134, 26, 3, 147)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (135, 25, 2, 147)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (136, 27, 1, 147)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (137, 60, 1, 148)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (138, 60, 1, 149)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (139, 60, 1, 150)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (140, 60, 1, 151)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (141, 60, 1, 152)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (142, 60, 1, 153)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (143, 60, 1, 154)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (144, 60, 1, 155)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (145, 60, 1, 160)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (146, 60, 1, 169)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (147, 60, 1, 170)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (148, 60, 1, 171)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (149, 60, 1, 172)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (150, 60, 1, 173)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (151, 60, 1, 174)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (152, 60, 1, 175)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (153, 60, 1, 176)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (154, 62, 1, 177)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (155, 62, 1, 178)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (156, 44, 3, 178)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (157, 62, 1, 179)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (158, 44, 3, 179)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (159, 62, 1, 180)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (160, 44, 3, 180)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (161, 60, 1, 182)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (162, 60, 1, 181)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (163, 60, 1, 183)
GO
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (164, 60, 1, 184)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (165, 60, 1, 185)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (166, 60, 1, 186)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (167, 62, 1, 187)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (168, 44, 3, 187)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (169, 36, 4, 188)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (170, 31, 2, 189)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (171, 25, 2, 190)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (172, 25, 2, 191)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (173, 25, 1, 192)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (174, 25, 1, 193)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (175, 25, 1, 194)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (176, 27, 1, 195)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (177, 27, 1, 196)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (178, 26, 3, 197)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (179, 25, 1, 198)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (180, 27, 1, 198)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (181, 27, 1, 199)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (182, 27, 1, 200)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (183, 27, 2, 202)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (184, 27, 2, 201)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (185, 25, 1, 204)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (186, 25, 1, 203)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (187, 26, 3, 206)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (188, 26, 3, 205)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (189, 27, 1, 207)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (190, 27, 1, 208)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (191, 26, 3, 209)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (192, 25, 1, 209)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (193, 27, 1, 209)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (194, 60, 1, 210)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (195, 73, 1, 210)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (196, 74, 1, 210)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (197, 36, 4, 211)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (198, 92, 1, 212)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (199, 91, 1, 213)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (200, 91, 1, 214)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (201, 91, 1, 215)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (202, 47, 2, 216)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (203, 45, 2, 217)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (204, 47, 1, 218)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (205, 45, 2, 219)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (206, 36, 1, 219)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (207, 47, 1, 219)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (208, 61, 1, 219)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (209, 50, 1, 219)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (210, 62, 1, 220)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (211, 44, 3, 220)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (212, 44, 1, 221)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (213, 22, 1, 222)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (214, 92, 1, 223)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (215, 92, 1, 224)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (216, 92, 1, 225)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (217, 92, 1, 226)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (218, 92, 1, 227)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (219, 92, 1, 228)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (220, 92, 1, 229)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (221, 91, 10, 230)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (222, 91, 4, 231)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (223, 92, 1, 232)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (224, 92, 1, 233)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (225, 79, 3, 234)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (226, 92, 1, 235)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (227, 93, 1, 236)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (228, 84, 1, 237)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (229, 93, 1, 238)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (230, 58, 1, 239)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (231, 62, 1, 240)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (232, 44, 1, 240)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (233, 93, 1, 241)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (234, 84, 1, 241)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (235, 56, 10, 241)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (236, 57, 1, 242)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (237, 87, 1, 243)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (238, 30, 1, 244)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (239, 60, 1, 245)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (240, 22, 1, 246)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (241, 87, 2, 247)
INSERT [dbo].[OrderDetails] ([Order_Detail_Id], [Product_Detail_Size_Id], [Quantity], [Order_Id]) VALUES (242, 94, 10, 248)
SET IDENTITY_INSERT [dbo].[OrderDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderPayments] ON 

INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (7, 66, 3600001, N'Đã thanh toán', CAST(N'2024-11-14T23:44:12.730' AS DateTime), N'nguyentuakina', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (8, 68, 3970368, N'Đã thanh toán', CAST(N'2024-11-15T03:14:04.293' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (9, 70, 3600000, N'Đã thanh toán', CAST(N'2024-11-15T03:17:36.770' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (10, 72, 3970368, N'Đã thanh toán', CAST(N'2024-11-15T03:21:38.440' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (11, 73, 370368, N'Đã thanh toán', CAST(N'2024-11-15T03:40:22.267' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (12, 74, 1200000, N'Đã thanh toán', CAST(N'2024-11-15T03:42:51.267' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (13, 76, 246912, N'Đã thanh toán', CAST(N'2024-11-15T12:57:58.097' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (14, 78, 600000, N'Đã thanh toán', CAST(N'2024-11-15T14:18:26.090' AS DateTime), N'myntd', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (15, 80, 600000, N'Đã thanh toán', CAST(N'2024-11-15T14:19:47.297' AS DateTime), N'myntd', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (16, 81, 123456, N'Đã thanh toán', CAST(N'2024-11-15T14:22:44.990' AS DateTime), N'myntd', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (17, 91, 2498498, N'Đã thanh toán', CAST(N'2024-11-26T15:11:39.150' AS DateTime), N'nguyentuakina', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (18, 119, 200000, N'Đã thanh toán', CAST(N'2024-12-02T15:30:15.423' AS DateTime), N'myntd', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (19, 121, 200000, N'Đã thanh toán', CAST(N'2024-12-02T15:35:00.770' AS DateTime), N'myntd', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (20, 129, 24624624, N'Đã thanh toán', CAST(N'2024-12-03T00:09:20.347' AS DateTime), N'nguyentuakina', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (21, 130, 360000, N'Đã thanh toán', CAST(N'2024-12-03T00:10:22.323' AS DateTime), N'nguyentuakina', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (22, 135, 1690000, N'Đã thanh toán', CAST(N'2024-12-03T16:28:40.727' AS DateTime), N'phihung', NULL)
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (23, 183, 1690000, N'Đã thanh toán', CAST(N'2024-12-04T18:30:34.157' AS DateTime), N'myntd', N'MoMo')
INSERT [dbo].[OrderPayments] ([Order_Payment_Id], [Order_Id], [Amount], [Status], [Date], [Username], [Reference_Code]) VALUES (24, 189, 9298000, N'Đã thanh toán', CAST(N'2024-12-04T19:57:13.983' AS DateTime), N'tufpt', NULL)
SET IDENTITY_INSERT [dbo].[OrderPayments] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (66, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-15T00:00:00.000' AS DateTime), N'Đã hoàn thành', 3600001, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (67, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-15T00:00:00.000' AS DateTime), N'Chờ thanh toán', 3970368, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (68, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-15T00:00:00.000' AS DateTime), N'Đã hoàn thành', 3970368, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (69, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-14T20:16:52.320' AS DateTime), N'Chờ thanh toán', 3600000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (70, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-15T20:16:58.387' AS DateTime), N'Đã hoàn thành', 3600000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (71, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-14T20:20:08.057' AS DateTime), N'Đã hoàn thành', 3970368, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (72, N'nguyentuakina', N'Tỉnh Phú Yên, Huyện Tuy An, Xã An Chấn, Thôn Phú Thạnh', N'0369678318', CAST(N'2024-11-14T20:21:02.410' AS DateTime), N'Đã hoàn thành', 3970368, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (73, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-14T20:39:40.193' AS DateTime), N'Đã hoàn thành', 370368, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (74, N'nguyentuakina', N'Thành phố Hồ Chí Minh, Quận 12, Phường Trung Mỹ Tây, 369/3/2 Tô Ký', N'0369678318', CAST(N'2024-11-14T20:42:10.570' AS DateTime), N'Đã hoàn thành', 1200000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (75, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-15T05:56:47.233' AS DateTime), N'Chờ thanh toán', 246912, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (76, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-15T05:57:01.617' AS DateTime), N'Đã hoàn thành', 246912, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (77, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T06:01:22.867' AS DateTime), N'Chờ thanh toán', 723460, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (78, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T07:17:21.180' AS DateTime), N'Đã hoàn thành', 600000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (79, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T07:18:55.860' AS DateTime), N'Chờ thanh toán', 600000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (80, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T07:19:20.557' AS DateTime), N'Đã hoàn thành', 600000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (81, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T07:22:17.130' AS DateTime), N'Đã hoàn thành', 123456, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (82, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-15T07:48:47.523' AS DateTime), N'Chờ thanh toán', 1, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (83, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0323456789', CAST(N'2024-11-15T08:00:13.157' AS DateTime), N'Đã hủy', 3123123, 8, NULL, N'Thời gian giao hàng quá lâu', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (84, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-17T06:52:09.277' AS DateTime), N'Đã hủy', 2498498.4, 1, 3, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (85, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-17T06:52:35.933' AS DateTime), N'Đã hủy', 2810810.7, 2, 2, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (87, N'107603460251462154012', N'123 To ky, Xã Động Quan, Huyện Lục Yên, Tỉnh Yên Bái', N'0369678318', CAST(N'2024-11-20T06:18:11.303' AS DateTime), N'Đã hủy', 6246246, 7, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (88, N'107603460251462154012', N'ok, Phường Hoàng Quế, Thị xã Đông Triều, Tỉnh Quảng Ninh', N'0369678318', CAST(N'2024-11-20T06:45:01.247' AS DateTime), N'Đã hủy', 3123123, 7, NULL, N'Sản phẩm không đáp ứng kỳ vọng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (89, N'107603460251462154012', N'123, Xã Cù Vân, Huyện Đại Từ, Tỉnh Thái Nguyên', N'0369678318', CAST(N'2024-11-20T06:56:31.063' AS DateTime), N'Đã hủy', 3123123, 7, NULL, N'Thời gian giao hàng quá lâu', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (90, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-26T08:10:02.210' AS DateTime), N'Đã hủy', 12312312, 8, NULL, N'Sản phẩm không đáp ứng kỳ vọng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (91, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-26T08:11:14.523' AS DateTime), N'Đang vận chuyển', 2498498.4, 2, 3, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (92, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-28T10:48:34.927' AS DateTime), N'Đã hoàn thành', 5621621.4, 7, 1, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (93, N'myntd', N'dsaas, Xã Đông Hưng B, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-11-29T10:33:35.633' AS DateTime), N'Đã hoàn thành', 123456, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (94, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-30T05:49:14.453' AS DateTime), N'Đã hủy', 22162161.6, 7, 1, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (95, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-11-30T05:50:17.237' AS DateTime), N'Đã hủy', 6246246, 7, NULL, N'Đã mua ở nơi khác', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (96, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-11-30T05:54:19.330' AS DateTime), N'Đã hủy', 370368, 7, NULL, N'Sản phẩm không đáp ứng kỳ vọng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (98, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-01T06:50:21.727' AS DateTime), N'Đã hoàn thành', 370368, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (103, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-01T06:52:39.430' AS DateTime), N'Đã hoàn thành', 444441.6, 8, 2, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (108, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-01T08:38:11.893' AS DateTime), N'Chờ thanh toán', 493824, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (115, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:23:47.360' AS DateTime), N'Chờ thanh toán', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (116, N'myntd', N'test vnpay, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:24:40.317' AS DateTime), N'Chờ thanh toán', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (117, N'myntd', N'vnpay, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:26:43.760' AS DateTime), N'Đã hoàn thành', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (118, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:29:28.887' AS DateTime), N'Đã hoàn thành', 100000, 8, 6, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (119, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:29:42.457' AS DateTime), N'Đã hoàn thành', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (120, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:30:45.757' AS DateTime), N'Chờ thanh toán', 200000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (121, N'myntd', N'MOMO, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:34:11.357' AS DateTime), N'Đã hoàn thành', 200000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (122, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-02T08:35:20.743' AS DateTime), N'Đã hoàn thành', 200000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (124, N'100928486128195800698', N'MOMO, Xã Săm Khóe, Huyện Mai Châu, Tỉnh Hoà Bình', N'0987654321', CAST(N'2024-12-02T08:46:26.753' AS DateTime), N'Chờ thanh toán', 400000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (125, N'100928486128195800698', N'AC, Xã Bình Sơn, Huyện Lục Nam, Tỉnh Bắc Giang', N'0987654321', CAST(N'2024-12-02T08:46:45.820' AS DateTime), N'Đã hủy', 400000, 7, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (128, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-02T17:01:31.907' AS DateTime), N'Chờ thanh toán', 360000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (129, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-02T17:08:56.420' AS DateTime), N'Đã hoàn thành', 24624624, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (130, N'nguyentuakina', N'369/3/2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-02T17:09:35.123' AS DateTime), N'Đã hoàn thành', 360000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (133, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-03T09:26:17.840' AS DateTime), N'Đã hủy', 1690000, 2, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (134, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-03T09:26:24.057' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (135, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-03T09:27:21.093' AS DateTime), N'Đã hoàn thành', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (136, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'', CAST(N'2024-12-04T07:02:06.373' AS DateTime), N'Đã hoàn thành', 3487000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (137, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'', CAST(N'2024-12-04T07:06:41.823' AS DateTime), N'Đã hoàn thành', 3487000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (141, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-04T07:33:02.997' AS DateTime), N'Đã hoàn thành', 400000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (144, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-04T07:44:30.367' AS DateTime), N'Đã hoàn thành', 3400000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (145, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0317985268', CAST(N'2024-12-04T07:45:58.080' AS DateTime), N'Đã hoàn thành', 15900000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (146, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-04T07:46:29.667' AS DateTime), N'Đã hủy', 15900000, 7, NULL, N'Đã mua ở nơi khác', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (147, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-04T07:51:38.243' AS DateTime), N'Đã hủy', 15900000, 7, NULL, N'Lý do khác: hết thích', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (148, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:30:32.423' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (149, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:38:16.103' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (150, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:40:02.127' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (151, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:40:41.473' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (152, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:44:18.713' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (153, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:45:25.033' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (154, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T09:45:42.943' AS DateTime), N'Chờ thanh toán', 1690000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (155, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:06:14.373' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (160, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:10:34.430' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (169, N'myntd', N'detail, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:45:45.553' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (170, N'myntd', N'detail, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:45:45.553' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (171, N'myntd', N'đổi vnpay, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:51:30.600' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (172, N'myntd', N'đổi vnpay, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:51:30.600' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (173, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:53:15.830' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (174, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:53:15.830' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (175, N'myntd', N'2 ỎDER, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:57:40.220' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (176, N'myntd', N'2 ỎDER, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T10:57:40.220' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (177, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'', CAST(N'2024-12-04T11:03:56.367' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (178, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987654321', CAST(N'2024-12-04T11:05:54.467' AS DateTime), N'Đã hủy', 3487000, 8, NULL, N'Lý do khác: abc', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (179, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987654321', CAST(N'2024-12-04T11:09:54.647' AS DateTime), N'Đã hoàn thành', 3487000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (180, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987654321', CAST(N'2024-12-04T11:10:46.487' AS DateTime), N'Đã hoàn thành', 3487000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (181, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T11:20:05.603' AS DateTime), N'Đã hủy', 1690000, 2, NULL, N'Thời gian giao hàng quá lâu', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (182, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T11:20:05.603' AS DateTime), N'Chờ thanh toán', 1690000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (183, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T11:29:48.357' AS DateTime), N'Đã hoàn thành', 1690000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (184, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'', CAST(N'2024-12-04T11:37:34.390' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (185, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-04T11:42:04.747' AS DateTime), N'Đã hoàn thành', 1690000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (186, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0987123456', CAST(N'2024-12-04T11:42:34.260' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (187, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987654321', CAST(N'2024-12-04T11:43:20.733' AS DateTime), N'Đã hoàn thành', 3487000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (188, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-04T12:46:33.977' AS DateTime), N'Đã hủy', 18396000, 7, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (189, N'tufpt', N'Không có, Xã Vũ Lăng, Huyện Bắc Sơn, Tỉnh Lạng Sơn', N'0369678318', CAST(N'2024-12-04T12:56:07.057' AS DateTime), N'Đã hoàn thành', 9298000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (190, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T17:28:26.367' AS DateTime), N'Chờ thanh toán', 6400000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (191, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T17:29:16.897' AS DateTime), N'Chờ thanh toán', 6400000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (192, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:04:30.870' AS DateTime), N'Đã hủy', 3200000, 8, NULL, N'Thời gian giao hàng quá lâu', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (193, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:07:02.537' AS DateTime), N'Chờ thanh toán', 3200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (194, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:07:02.537' AS DateTime), N'Chờ thanh toán', 3200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (195, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:17:44.053' AS DateTime), N'Chờ thanh toán', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (196, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:17:44.053' AS DateTime), N'Chờ thanh toán', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (197, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:24:53.773' AS DateTime), N'Chờ thanh toán', 9300000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (198, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:28:32.700' AS DateTime), N'Chờ thanh toán', 3400000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (199, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:34:28.813' AS DateTime), N'Chờ thanh toán', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (200, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:36:24.467' AS DateTime), N'Đã hoàn thành', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (201, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:59:58.750' AS DateTime), N'Đã hoàn thành', 400000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (202, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T18:59:58.750' AS DateTime), N'Đã hoàn thành', 400000, 2, NULL, NULL, 0)
GO
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (203, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T19:05:06.503' AS DateTime), N'Đã hoàn thành', 3200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (204, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T19:05:06.503' AS DateTime), N'Đã hoàn thành', 3200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (205, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T19:06:19.730' AS DateTime), N'Đã hủy', 9300000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (206, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T19:06:19.730' AS DateTime), N'Đang vận chuyển', 9300000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (207, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T19:09:05.447' AS DateTime), N'Đang vận chuyển', 200000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (208, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T20:18:10.800' AS DateTime), N'Đang vận chuyển', 200000, 1, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (209, N'100928486128195800698', N'Đông Hòa, Xã Tân Khánh Đông, Thành phố Sa Đéc, Tỉnh Đồng Tháp', N'0374862645', CAST(N'2024-12-07T20:26:50.343' AS DateTime), N'Đã hủy', 12700000, 2, NULL, N'Đã mua ở nơi khác', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (210, N'huuthanh', N'thôn Trai Bản, Xã Thạch Hóa, Huyện Tuyên Hóa, Tỉnh Quảng Bình', N'0378426216', CAST(N'2024-12-09T09:16:19.547' AS DateTime), N'Đã hoàn thành', 5070000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (211, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-09T09:59:09.900' AS DateTime), N'Đã hoàn thành', 18396000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (212, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-10T10:03:22.463' AS DateTime), N'Đã hoàn thành', 725000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (213, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-10T10:19:44.597' AS DateTime), N'Đã hủy', 225000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (214, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-10T10:27:15.637' AS DateTime), N'Đã hủy', 225000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (215, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-10T10:29:41.033' AS DateTime), N'Đã hủy', 225000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (216, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-11T07:18:56.840' AS DateTime), N'Đã hoàn thành', 1298000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (217, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-11T07:25:54.627' AS DateTime), N'Đã hoàn thành', 1258000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (218, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-11T07:36:01.353' AS DateTime), N'Đã hoàn thành', 649000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (219, N'nguyentuakina', N'Ngọc Thành, Xã Vân Khánh Đông, Huyện An Minh, Tỉnh Kiên Giang', N'0369678318', CAST(N'2024-12-11T09:10:01.600' AS DateTime), N'Đã hoàn thành', 8716000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (220, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987651234', CAST(N'2024-12-12T17:35:19.107' AS DateTime), N'Đã hoàn thành', 3487000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (221, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0912348765', CAST(N'2024-12-12T17:54:38.583' AS DateTime), N'Đã hoàn thành', 599000, 7, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (222, N'dieumy', N'Khu phố 1, Xã Bản Bo, Huyện Tam Đường, Tỉnh Lai Châu', N'0374862645', CAST(N'2024-12-13T01:03:17.583' AS DateTime), N'Đã hoàn thành', 190000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (223, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T14:50:15.557' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Đã mua ở nơi khác', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (224, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T14:56:18.063' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (225, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T14:59:10.003' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (226, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T15:04:56.253' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (227, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T15:09:04.720' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (228, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T15:11:09.190' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (229, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0963861480', CAST(N'2024-12-13T15:12:09.877' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (230, N'myntd', N'dsaas, Phường 05, Quận Gò Vấp, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-14T20:26:29.823' AS DateTime), N'Đã hoàn thành', 2250000, 8, NULL, NULL, 18489.344469626307)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (231, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0369678318', CAST(N'2024-12-14T20:29:42.370' AS DateTime), N'Đã hoàn thành', 1000000, 8, NULL, NULL, 100000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (232, N'phihung', N'39/6A, Nam Lân 3E, Phường 10, Quận Phú Nhuận, Thành phố Hồ Chí Minh', N'0365131846', CAST(N'2024-12-15T19:12:34.460' AS DateTime), N'Đã hoàn thành', 671634, 2, NULL, NULL, 19134)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (233, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0365131846', CAST(N'2024-12-15T19:17:18.827' AS DateTime), N'Đã hoàn thành', 735000, 8, NULL, NULL, 10000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (234, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0365131846', CAST(N'2024-12-15T19:28:50.997' AS DateTime), N'Đã hủy', 6490000, 1, 1, N'Đã mua ở nơi khác', 10000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (235, N'phihung', N'39/6A, Nam Lân 3E, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh', N'0365131846', CAST(N'2024-12-15T19:40:27.550' AS DateTime), N'Đã hủy', 725000, 8, NULL, N'Thay đổi ý định mua hàng', 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (236, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0398917439', CAST(N'2024-12-15T22:52:56.500' AS DateTime), N'Đã hoàn thành', 2390000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (237, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0398917439', CAST(N'2024-12-15T22:54:00.243' AS DateTime), N'Đã hoàn thành', 3150000, 8, 2, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (238, N'huuthanh', N'thôn Trai Bản, Xã Thạch Hóa, Huyện Tuyên Hóa, Tỉnh Quảng Bình', N'0398917439', CAST(N'2024-12-15T23:00:02.587' AS DateTime), N'Đã hoàn thành', 2390000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (239, N'huuthanh', N'thôn Trai Bản, Xã Thạch Hóa, Huyện Tuyên Hóa, Tỉnh Quảng Bình', N'0398917439', CAST(N'2024-12-15T23:01:42.650' AS DateTime), N'Đã hoàn thành', 500000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (240, N'chusan', N'abc, Phường Vĩnh Ngươn, Thành phố Châu Đốc, Tỉnh An Giang', N'0987654321', CAST(N'2024-12-16T18:32:48.627' AS DateTime), N'Đã hoàn thành', 2160100, 1, 25, NULL, 100000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (241, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0374968107', CAST(N'2024-12-17T00:05:08.430' AS DateTime), N'Đã hoàn thành', 8690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (242, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0374968107', CAST(N'2024-12-17T00:05:51.907' AS DateTime), N'Đã hoàn thành', 600000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (243, N'tanthanh', N'123, Xã Bản Mế, Huyện Si Ma Cai, Tỉnh Lào Cai', N'0398917328', CAST(N'2024-12-17T00:15:57.110' AS DateTime), N'Đã hoàn thành', 1230000, 8, NULL, NULL, 100000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (244, N'tanthanh', N'123, Xã Bản Mế, Huyện Si Ma Cai, Tỉnh Lào Cai', N'0398917439', CAST(N'2024-12-17T00:16:17.573' AS DateTime), N'Đã hoàn thành', 4699000, 8, NULL, NULL, 100000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (245, N'tanthanh', N'123, Xã Bản Mế, Huyện Si Ma Cai, Tỉnh Lào Cai', N'0398917439', CAST(N'2024-12-17T00:16:28.070' AS DateTime), N'Đã hoàn thành', 1690000, 8, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (246, N'nguyentuakina', N'48/5D2 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'0369678318', CAST(N'2024-12-17T00:53:17.313' AS DateTime), N'Đang vận chuyển', 190000, 2, NULL, NULL, 0)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (247, N'nguyentuakina', N'Thôn Phú Thạnh, Xã An Chấn, Huyện Tuy An, Tỉnh Phú Yên', N'0369678318', CAST(N'2024-12-17T13:35:55.543' AS DateTime), N'Đã hủy', 2360000, 2, NULL, N'Lý do khác: ABC', 100000)
INSERT [dbo].[Orders] ([Order_Id], [Username], [Address], [Phone_Number], [Date], [Status], [Amount], [Payment_Method_Id], [Voucher_Id], [Note], [Ship_Fee]) VALUES (248, N'myntd', N'dsaas, Xã Hiền Lương, Huyện Đà Bắc, Tỉnh Hoà Bình', N'0374968107', CAST(N'2024-12-21T15:48:24.110' AS DateTime), N'Đã hủy', 9660000, 8, 21, N'Lý do khác: ', 100000)
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[Owners] ON 

INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (1, N'myntd', NULL, NULL, NULL)
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (3, N'nguyentuakina', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (6, N'nguyentuakinapy', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (11, N'nguyentuakina123', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (13, N'100928486128195800698', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (37, N'chusan', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (38, N'116043414437118260556', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (44, N'tupy123', N'', N'', N'')
INSERT [dbo].[Owners] ([Owner_Id], [Username], [Bank_Account], [Momo_Account], [Vnpay_Account]) VALUES (45, N'tuakinapy', N'', N'', N'')
SET IDENTITY_INSERT [dbo].[Owners] OFF
GO
SET IDENTITY_INSERT [dbo].[PaymentMethods] ON 

INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (1, N'MoMo', N'Thanh toán qua ví điện thử MoMo')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (2, N'VNPay', N'Thanh toán qua ví điện tử VNPay')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (3, N'Credit Card', N'Thanh toán qua thẻ tín dụng')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (4, N'Bank Transfer', N'Chuyển khoản ngân hàng')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (6, N'Thanh toán tại sân', N'Thanh toán trực tiếp')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (7, N'Thanh toán ví', N'Thanh toán ví')
INSERT [dbo].[PaymentMethods] ([Payment_Method_Id], [Name], [Description]) VALUES (8, N'COD', N'Thanh toán khi nhận hàng')
SET IDENTITY_INSERT [dbo].[PaymentMethods] OFF
GO
SET IDENTITY_INSERT [dbo].[PhoneNumbers] ON 

INSERT [dbo].[PhoneNumbers] ([Phone_Number_Id], [Phone_Number]) VALUES (15, N'0963861480')
INSERT [dbo].[PhoneNumbers] ([Phone_Number_Id], [Phone_Number]) VALUES (17, N'0374862645')
INSERT [dbo].[PhoneNumbers] ([Phone_Number_Id], [Phone_Number]) VALUES (18, N'0365131846')
INSERT [dbo].[PhoneNumbers] ([Phone_Number_Id], [Phone_Number]) VALUES (19, N'0369678318')
INSERT [dbo].[PhoneNumbers] ([Phone_Number_Id], [Phone_Number]) VALUES (20, N'0374968107')
SET IDENTITY_INSERT [dbo].[PhoneNumbers] OFF
GO
SET IDENTITY_INSERT [dbo].[PhoneNumberUser] ON 

INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (17, 17, N'100928486128195800698', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (18, 15, N'devka123', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (21, 17, N'dieumy', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (22, 18, N'phihung', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (24, 19, N'nguyentuakina', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (25, 20, N'myntd', 1)
INSERT [dbo].[PhoneNumberUser] ([Phone_Number_User_Id], [Phone_Number_Id], [Username], [Active]) VALUES (26, 20, N'chusan', 1)
SET IDENTITY_INSERT [dbo].[PhoneNumberUser] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductDetails] ON 

INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (3, 2, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203037/h5ymov7iel3eluhehxrb.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (25, 22, N'Cam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733727883/lfzrasad99hupgvnaulj.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (26, 22, N'Hồng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733732426/u4yj3zcxib5gliitlbup.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (27, 25, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202759/hyveezk4fdpcwzwde7gh.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (29, 54, N'Vàng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202548/dzamsb2pf43cckscav1d.png')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (31, 66, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201693/uz9fqbqi0klcidh3komv.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (35, 65, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201909/fgkwqrutwhj2obd8m3hj.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (38, 67, N'Trắng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201005/plkzhfzyvr9pw5ntktqk.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (39, 68, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200887/owsdtxpoc3rpwd5dxrpr.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (40, 69, N'Cam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200756/zffgxforbplb0ts0yapx.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (41, 71, N'Cam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200270/vvq3pb8ucfjmlmbufias.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (42, 70, N'Cam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200436/ipgh9pmyzs0ep01wkjcp.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (43, 60, N'Vàng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202399/laird3dvw2ehwliis1um.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (44, 64, N'Vàng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202260/cmuqhswol68gulfcv4bt.png')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (46, 72, N'Hồng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200064/wbokt2hnnwpyky0tbbjp.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (48, 73, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199798/yyaygwbiijbvifecdqgw.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (49, 74, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199039/kzdu49vkp3izoxbkh7jr.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (50, 75, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196415/bqpbnkitab7tuuwpas8y.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (51, 76, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194384/ls7xftemse5kx9aot0db.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (53, 77, N'Xanh', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733198206/u2mnhjmnn3mo0dwepwhn.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (54, 74, N'Vàng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199320/lrre61dskr81abynlsip.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (55, 80, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203461/iewhnnccc8axqebt5eqe.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (56, 81, N'Cam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203559/n6hhd2qiolbp6ld8xoh8.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (57, 82, N'Xanh', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203705/amfl1pub3xfhihve1gug.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (58, 82, N'Hồng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733323036/nfkmpb5alvb1vcscgvkb.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (59, 81, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733324030/rontceyh0z7pzes50slc.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (60, 83, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734439/dr0ugrjsunfvnqcih6t1.webp')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (61, 84, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734751/zdzupesrkciiihgzevsb.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (62, 86, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733735518/pxe5wjt2b6ua7bieur7b.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (63, 87, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733736070/ssdpdkojjgejd4ilzyne.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (64, 88, N'Xanh biển', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733738763/xabtzzjd89zinkbqsflm.webp')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (65, 89, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754315/rimxmmovayjy3jbyhwm5.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (66, 90, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754558/d4ydhkt8fieyrucfmhyk.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (67, 91, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754739/bfs6iyfbrmdhvc9lbtrt.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (68, 92, N'Trắng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734159332/krelkpz8nqzi28jyjki5.png')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (69, 93, N'Đen', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734363407/l0vwgrhmgmpkhekhxcfn.jpg')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (70, 93, N'Đỏ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734409773/oyusuepmklttccu8y02q.webp')
INSERT [dbo].[ProductDetails] ([Product_Detail_Id], [Product_Id], [Color], [Image]) VALUES (71, 94, N'Vàng', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734418237/ahkthaocrzlr5w1ua5qb.jpg')
SET IDENTITY_INSERT [dbo].[ProductDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductDetailSize] ON 

INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (4, 3, 9, 5900000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (8, 3, 1, 5900000, 300)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (17, 27, 3, 2900000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (19, 25, 2, 2000000, 4000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (22, 38, 3, 190000, 348)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (23, 41, 5, 2220000, 210)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (24, 41, 1, 2300000, 120)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (25, 42, 1, 3200000, 57)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (26, 42, 7, 3100000, 141)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (27, 40, 3, 200000, 187)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (30, 46, 1, 4599000, 41)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (31, 46, 2, 4649000, 101)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (32, 46, 8, 4699000, 320)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (36, 48, 2, 4599000, 149)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (37, 51, 12, 1699000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (42, 50, 12, 1699000, 105)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (43, 50, 13, 1799000, 59)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (44, 53, 12, 599000, 210)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (45, 53, 13, 629000, 496)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (46, 49, 14, 599000, 520)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (47, 49, 13, 649000, 408)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (48, 49, 12, 699000, 222)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (49, 54, 12, 599000, 10)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (50, 40, 2, 210000, 79)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (51, 39, 3, 300000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (52, 39, 2, 320000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (53, 31, 3, 200000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (54, 31, 1, 250000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (55, 35, 2, 200000, 300)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (56, 44, 15, 280000, 290)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (57, 43, 15, 600000, 499)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (58, 29, 15, 500000, 499)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (59, 27, 4, 2500000, 50)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (60, 55, 12, 1690000, 81)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (61, 56, 2, 2000000, 199)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (62, 57, 4, 1690000, 492)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (63, 58, 2, 1690000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (64, 58, 1, 1790000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (65, 26, 2, 2000000, 300)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (66, 26, 3, 2000000, 500)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (67, 26, 4, 2000000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (68, 25, 3, 2000000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (69, 25, 4, 2000000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (70, 57, 2, 1699000, 1000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (71, 57, 3, 1699000, 2000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (72, 58, 3, 1699000, 500)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (73, 55, 13, 1690000, 1999)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (74, 55, 14, 1690000, 3999)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (75, 60, 7, 529000, 2000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (76, 60, 8, 529000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (77, 60, 6, 529000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (78, 61, 7, 2400000, 2000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (79, 61, 6, 2400000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (80, 61, 8, 2400000, 1000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (81, 62, 7, 2900000, 4000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (82, 62, 8, 2900000, 300)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (83, 62, 6, 2900000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (84, 63, 7, 3500000, 2998)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (85, 63, 6, 3500000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (86, 63, 8, 3500000, 500)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (87, 64, 7, 1130000, 4999)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (88, 64, 6, 1130000, 300)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (89, 64, 8, 1130000, 500)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (90, 65, 16, 1195000, 800)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (91, 66, 16, 225000, 986)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (92, 67, 16, 725000, 10000)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (93, 68, 15, 2390000, 9997)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (94, 68, 16, 2390000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (95, 69, 15, 220000, 200)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (96, 69, 12, 300000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (97, 70, 12, 250000, 3)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (98, 71, 1, 200000, 100)
INSERT [dbo].[ProductDetailSize] ([Product_Detail_Size_Id], [Product_Detail_Id], [Size_Id], [Price], [Quantity]) VALUES (99, 71, 2, 100000, 100)
SET IDENTITY_INSERT [dbo].[ProductDetailSize] OFF
GO
SET IDENTITY_INSERT [dbo].[Productreviews] ON 

INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (1, 2, N'nguyentuakina', 4, N'Sản phẩm này tên gì vậy', CAST(N'2024-11-01T14:25:54.923' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (5, 71, N'nguyentuakina', 5, N'sản phẩm này như thế nào vây ?', CAST(N'2024-11-15T16:06:41.323' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (8, 70, N'nguyentuakina', 4, N'Sản phẩm này có ăn được không?', CAST(N'2024-11-26T19:23:21.580' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (9, 71, N'107603460251462154012', 4, N'Chỉ biết ước chứ tiền đâu mua', CAST(N'2024-11-26T20:04:34.883' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (12, 69, N'nguyentuakina', 2, N'Cầu này sài mau hư quá', CAST(N'2024-11-29T17:21:38.717' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (21, 72, N'tufpt', 5, N'Giày này màu đẹp quá ạ', CAST(N'2024-12-04T19:58:44.293' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (22, 80, N'huuthanh', 5, N'sản phẩm tốt đẹp, very good', CAST(N'2024-12-09T16:21:34.717' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (23, 91, N'phihung', 5, N'Sản phẩm này nhìn đẹp quá, đã thế còn hot trend, sốp hay quá sốp', CAST(N'2024-12-15T19:38:13.130' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (24, 77, N'chusan', 4, N'sản phẩm tốt', CAST(N'2024-12-16T18:33:40.800' AS DateTime))
INSERT [dbo].[Productreviews] ([Product_Review_Id], [Product_Id], [Username], [Rating], [Comment], [Dated_At]) VALUES (25, 77, N'nguyentuakina', 5, N'TỐT', CAST(N'2024-12-17T13:36:41.843' AS DateTime))
SET IDENTITY_INSERT [dbo].[Productreviews] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (2, N'Giày đá bóng Mizuno Morelia Neo IV Elite FG/AG Mugen - White/Laser Blue P1GA243225', 1, N'Morelia là dòng sản phẩm lâu đời nhất của Mizuno (ra mắt năm 1985), nhưng trải qua gần 30 năm hình thành và phát triển, Moreila đang không ngừng cải tiến từng ngày, từ thiết kế đến công nghệ nhằm bắt kịp xu thế hiện đại. Morelia III Beta cũng là dòng sản phẩm được Sergio Ramos làm đại diện trước khi chuyển qua Mizuno Alpha. Giữa thị trường giày bóng đá ngày càng đa dạng với nhiều thương hiệu đình đám, chúng ta vẫn phải công nhận những cải tiến và đột phá của mình đã giúp Mizuno có chỗ đứng vững chắc trong lòng người hâm mộ.

Mizuno thương hiệu thể thao đến từ Nhật Bản, vừa ra mắt Morelia SALA MADE IN JAPAN  "Mugen", phiên bản giày đá banh cao cấp, kết tinh tinh hoa thủ công và công nghệ tiên tiến. "Mugen" (Vô hạn), thể hiện sự theo đuổi không ngừng nghỉ của Mizuno trong việc hoàn thiện dòng giày Morelia Neo, mang đến cho người chơi trải nghiệm thoải mái và hiệu suất tối ưu.', N'Còn hàng', CAST(N'2024-09-18T00:00:00.000' AS DateTime), N'Mizuno', N'Nhật', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203034/o6nfj3nabsc6prbio0yq.jpg', 5900000, 500)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (22, N'Giày đá bóng Nike Air Zoom Mercurial Vapor 15 Pro TF Luminous - Pink Blast/Volt/Gridiron DJ5605-605', 1, N'Cầu thủ nổi tiếng đại diện: Bruno Fernandes, Rashford, Hazard...

Bộ sưu tập: Peak Ready.

Năm sản xuất: 2023.

Chất liệu: Da tổng hợp Nikeskin kết hợp sợi dệt cao cấp 2 chiều.

Công nghệ: Cổ thun cao cấp, Upper được cải tiến những đường vân tăng độ bám, đế đệm túi khí Airzoom và lót đệm cao su êm ái.

Trọng lượng: 238 gram/chiếc (Size 41).

Phong cách: Tấn công, tốc độ.

Vị trí: Tiền vệ cánh, tiền đạo.

Form giày: Phù hợp form chân thon/chân bè.

Mặt sân: Cỏ nhân tạo 5-7 người.
VB7000 làm b?ng da t?ng h?p c?a Nh?t B?n
Màu s?c: xanh + vàng + tr?ng.
Size: s? 5.
Chu vi bóng: 650 - 670mm.
Tr?ng lu?ng: 260 - 280 gram.
Ð? n?y: 90 - 120cm.', N'Còn hàng', CAST(N'2024-10-11T00:00:00.000' AS DateTime), N'Nike', N'Nhật Bản', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202867/mpx5pbuofhawbppspolv.jpg', 2000000, 5200)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (25, N'Giày Bóng Rổ', 6, N'Giày Bóng R? Tr? Em PEAK Monster EK41030A

-Size: 35-39
-Màu s?c: Ð?, Ðen
- Công ngh?: P-Ultralingt, PEAK TAICHI
Thi?t k? ?n tu?ng và n?i b?t du?c l?y c?m h?ng t? nh?ng chi?c rang s?c nh?n c?a quái thú k?t h?p cùng h?a ti?t 3D thu hút khoi g?i ni?m khao khát chi?n d?u mãnh li?t cho baller nhí

Ph?n dây giày thi?t k? FAST   d?c bi?t v?i nút v?n di?u ch?nh dây giày t? d?ng giúp bé d? dàng ki?m soát d? r?ng phù h?p v?i chân.

Upper là s? k?t h?p gi?a v?i d?t và v?i lu?i thoáng khí, ph?n lu?i gà v?i thân giày giúp giày ôm sát chân, d? dàng trong nh?ng chuy?n d?ng m?nh

Công ngh? d?m nh? P – Ultralight c?i ti?n giúp form giày tr? nên m?m m?i tang d? dàn h?i và gi?m b?t tr?ng lu?ng mang d?n c?m nh?n nh? nhàng khi di chuy?n

L?p d? ngoài d?c dáo v?i s? k?t h?p gi?a các ph?i màu n?i b?t và ch?t li?u cao su, tang kh? nang ch?ng mài mòn. L?p vân d? xuong cá gia tang d? b?n c?a d?, h?n ch? tron tru?t."

CÔNG D?NG:

-Giày bóng r? tr? em thích h?p choi c? sân oudoor và sân indoor

-Có th? k?t h?p giày bóng r? d? choi 1 s? môn th? thao v?n d?ng nh? nhàng khác d?o b?, choi bóng chuy?n, c?u lông

-Thi?t k? t?i gi?n basic có th? s? d?ng hàng ngày d? di choi mang di h?c', N'Còn hàng', CAST(N'2024-10-11T00:00:00.000' AS DateTime), N'PEAK', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202780/asig5voolcic78gxwoez.jpg', 100000, 150)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (54, N'Quả Bóng Rổ Geru Cao Su 3x3', 6, N'Quả banh bóng rổ Gerustar 3X3 là dòng sản phẩm mới nhất của công ty vừa được ra mắt vào ngày 15/3/2018.
Bóng kích thước tương đương size 6

Cân nặng tương đương size 7

Thừa hưởng công nghệ da quấn Federation

Bóng cầm rất bám dính, độ nảy cao.

Đường kính size 6: 23,6 cm

 ', N'Còn hàng', CAST(N'2024-10-23T00:00:00.000' AS DateTime), N'Geru', N'Nhật', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733755013/rdnsuz267jmfow1r7lh2.jpg', 500000, 499)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (60, N'Bóng chuyền Thăng Long VB7000', 2, N'Banh bóng chuyền thi đấu da Nhật VB7000 chính hãng Thăng Long được may cực chắc chắn, tròn đều từ chất liệu da PU nhung cho độ nảy chính xác. Quả bóng giữ hơi tốt và tạo cảm giác êm tay khi chơi.

VB7000 làm bằng da tổng hợp của Nhật Bản
Màu sắc: xanh + vàng + trắng.
Size: số 5.
Chu vi bóng: 650 - 670mm.
Trọng lượng: 260 - 280 gram.
Độ nảy: 90 - 120cm.', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Thăng Long', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1731657184/aeyinxlyuviwgjpnyii8.jpg', 600000, 499)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (64, N'Bóng đá futsal dán FS 4.105D Ventura số 4', 1, N'Bóng đá Futsal dán FS 4.105D Ventura – Sự lựa chọn hoàn hảo cho sân futsal! 

Đặc điểm nổi bật 

Họa tiết bóng đá Futsal dán FS 4.105D Ventura lấy cảm hứng từ chữ "V" trong tên gọi Ventura, biểu tượng của sự mạo hiểm và quyết đoán. Họa tiết chữ V được sắp xếp đối xứng trên 6 mảnh ghép của quả bóng, kết hợp màu sắc tinh tế, tạo nên một thiết kế nổi bật và ấn tượng. 

Bóng được làm từ chất liệu PVC giả da trơn bóng, bền bỉ, có khả năng chống mài mòn và chịu va đập tốt, giúp đảm bảo độ bền cao khi sử dụng trên sân futsal. 

Công nghệ dán Laminate hiện đại giúp độ thấm nước < 5%, đảm bảo bóng hoạt động tốt trong nhiều điều kiện thời tiết khác nhau, mang đến độ bền cao. 

Ruột Vecxi cuốn sợi giúp bóng giữ được độ tròn hoàn hảo và độ nảy ổn định sau nhiều lần lăn, mang lại trải nghiệm chơi bóng mượt mà. 

Thông số kỹ thuật 

Trọng lượng (gram): 400-440 

Chu vi (mm): 620-640 

Độ nảy (cm): 50-65

Màu sắc: Vàng, trắng

Mã SP: FS 4.105D VENTURA

Size: 4', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Động lực', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733202256/g38asbquontsevqqd3oa.png', 280000, 290)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (65, N'Áo Câu Lạc Bộ Manchester United Sân Khách 2024-2025', 1, N'Quần Áo là loại quần áo thi đấu chính thức của các cầu thủ tại, Chất liệu vải cao cấp, logo đội bóng, tên cầu thủ, số áo được thêu rất chắc chắn có độ hoàn thiện rất cao, không bị bong tróc như chất liệu in ấn thông thường.', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'Viet Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201906/f7jc1hb7nboj4wdka7dj.jpg', 200000, 300)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (66, N'Áo Bóng Đá Câu Lạc Bộ Manchester United Sân Nhà 2024-2025', 1, N'Quần Áo là loại quần áo thi đấu chính thức của các cầu thủ tại, Chất liệu vải cao cấp, logo đội bóng, tên cầu thủ, số áo được thêu rất chắc chắn có độ hoàn thiện rất cao, không bị bong tróc như chất liệu in ấn thông thường.', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733201690/pkpeshw6nmmiv1p1ojyq.jpg', 200000, 200)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (67, N'Áo Bóng Đá Câu Lạc Bộ Tottenham Sân Nhà 2024-2025', 1, N'Áo Bóng Đá Câu Lạc Bộ Tottenham Sân Nhà 2024-2025
Quần Áo là loại quần áo thi đấu chính thức của các cầu thủ tại, Chất liệu vải cao cấp, logo đội bóng, tên cầu thủ, số áo được thêu rất chắc chắn có độ hoàn thiện rất cao, không bị bong tróc như chất liệu in ấn thông thường.
', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'Nhật Bản', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754873/b36dzny8ihkor1hemhog.jpg', 190000, 349)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (68, N'Áo Thi Đấu Câu Lạc Bộ PSG Sân Nhà 2024-2025', 1, N'Áo Thi Đấu Câu Lạc Bộ PSG Sân Nhà 2024-2025
quần Áo là loại quần áo thi đấu chính thức của các cầu thủ tại Laliga, Chất liệu vải cao cấp, logo đội bóng, tên cầu thủ, số áo được thêu rất chắc chắn có độ hoàn thiện rất cao, không bị bong tróc như chất liệu in ấn thông thường.
', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'Japan', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754848/pdypohjum1gsy7l1afhe.jpg', 300000, 300)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (69, N'Áo Bóng Đá Câu Lạc Bộ Real Madrid Sân Khách 2024-2025', 1, N'Quần Áo là loại quần áo thi đấu chính thức của các cầu thủ tại Laliga, Chất liệu vải cao cấp, logo đội bóng, tên cầu thủ, số áo được thêu rất chắc chắn có độ hoàn thiện rất cao, không bị bong tróc như chất liệu in ấn thông thường.
', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'Japan', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754810/blynsachwxq3f112dcu0.jpg', 290000, 267)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (70, N'Dame 6 Geek Up', 6, N'Thông số kỹ thuật

Phân khúc : Academy (tầm trung).

Phần upper làm từ da tổng hợp mềm mại được mô phỏng theo chất liệu sợi dệt sẽ mang đến cảm giác thật chân nhất trong từng pha chạm bóng. Trên bề mặt Phantom Luna 2 Academy TF được trang bị thêm lớp phủ NikeSkin giúp tăng độ bám bóng, từ đó người chơi có thể kiểm soát và rê bóng tốt hơn ở bất kỳ điều kiện thời tiết. 

Công nghệ Strike Zone với các vân vòng tròn được in dập nổi ở những vùng tiếp xúc bóng chủ yếu giúp tăng thêm độ xoáy cho những cú phất bóng và cứa lòng. 

Hệ thống dây giày được thiết kế lệch về phía má ngoài nhằm mở rộng diện tích sút và chuyền bóng.

Phần cổ thun Dynamic Fit được thiết kế theo công nghệ Asym Fit giúp ôm trọn khu vực cổ chân của bạn, tạo cảm giác chắc chắn, đồng thời hạn chế tình trạng các hạt cao su rơi vào giày khi chơi bóng. 

Gót giày được làm từ vải nhung, mang lại cảm giác ôm chân thoải mái. Đặc biệt, khung bọc gót bên ngoài được thiết kế nhằm làm giảm áp lực tác động lên khu vực gót chân người mang mà không gây ảnh hưởng đến cấu trúc và sự ổn định của đôi giày.

Bộ đệm EVA tạo cảm giác êm ái trong từng pha di chuyển, đồng thời giúp hạn chế phản lực từ bề mặt sân cỏ nhân tạo cứng lên các khớp gối và gót. 

Đế ngoài làm từ chất liệu cao su cao cấp với các đinh dạng Elip lớn nhỏ khác nhau, hỗ trợ khả năng xử lý bóng bằng gầm và tăng cường độ bám sân.

Phù hợp với cầu thủ có thiên hướng rê dắt, kiểm soát và phân phối bóng, sử dụng kỹ thuật. 

Bộ sưu tập: Mad Voltage Pack (10/2024).', N'Còn hàng', CAST(N'2024-10-28T00:00:00.000' AS DateTime), N'Nike', N'Nhật', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200433/nqejcj7tdvu539q2spwi.jpg', 3100000, 214)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (71, N'Pro Bounce Orange', 6, N'Thông số kỹ thuật

Phân khúc : Academy (tầm trung).

Phần upper làm từ da tổng hợp mềm mại được mô phỏng theo chất liệu sợi dệt sẽ mang đến cảm giác thật chân nhất trong từng pha chạm bóng. Trên bề mặt Phantom Luna 2 Academy TF được trang bị thêm lớp phủ NikeSkin giúp tăng độ bám bóng, từ đó người chơi có thể kiểm soát và rê bóng tốt hơn ở bất kỳ điều kiện thời tiết. 

Công nghệ Strike Zone với các vân vòng tròn được in dập nổi ở những vùng tiếp xúc bóng chủ yếu giúp tăng thêm độ xoáy cho những cú phất bóng và cứa lòng. 

Hệ thống dây giày được thiết kế lệch về phía má ngoài nhằm mở rộng diện tích sút và chuyền bóng.

Phần cổ thun Dynamic Fit được thiết kế theo công nghệ Asym Fit giúp ôm trọn khu vực cổ chân của bạn, tạo cảm giác chắc chắn, đồng thời hạn chế tình trạng các hạt cao su rơi vào giày khi chơi bóng. 

Gót giày được làm từ vải nhung, mang lại cảm giác ôm chân thoải mái. Đặc biệt, khung bọc gót bên ngoài được thiết kế nhằm làm giảm áp lực tác động lên khu vực gót chân người mang mà không gây ảnh hưởng đến cấu trúc và sự ổn định của đôi giày.

Bộ đệm EVA tạo cảm giác êm ái trong từng pha di chuyển, đồng thời giúp hạn chế phản lực từ bề mặt sân cỏ nhân tạo cứng lên các khớp gối và gót. 

Đế ngoài làm từ chất liệu cao su cao cấp với các đinh dạng Elip lớn nhỏ khác nhau, hỗ trợ khả năng xử lý bóng bằng gầm và tăng cường độ bám sân.

Phù hợp với cầu thủ có thiên hướng rê dắt, kiểm soát và phân phối bóng, sử dụng kỹ thuật. 

Bộ sưu tập: Mad Voltage Pack (10/2024).', N'Còn hàng', CAST(N'2024-11-07T15:25:13.607' AS DateTime), N'ADIDAS', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200266/vnpbsi3mzp1qxfv8kio5.jpg', 2200000, 330)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (72, N'Giày bóng rổ Harden Vol.6 Clear Pink', 6, N'Thông số kỹ thuật

Phân khúc : Academy (tầm trung).

Phần upper làm từ da tổng hợp mềm mại được mô phỏng theo chất liệu sợi dệt sẽ mang đến cảm giác thật chân nhất trong từng pha chạm bóng. Trên bề mặt Phantom Luna 2 Academy TF được trang bị thêm lớp phủ NikeSkin giúp tăng độ bám bóng, từ đó người chơi có thể kiểm soát và rê bóng tốt hơn ở bất kỳ điều kiện thời tiết. 

Công nghệ Strike Zone với các vân vòng tròn được in dập nổi ở những vùng tiếp xúc bóng chủ yếu giúp tăng thêm độ xoáy cho những cú phất bóng và cứa lòng. 

Hệ thống dây giày được thiết kế lệch về phía má ngoài nhằm mở rộng diện tích sút và chuyền bóng.

Phần cổ thun Dynamic Fit được thiết kế theo công nghệ Asym Fit giúp ôm trọn khu vực cổ chân của bạn, tạo cảm giác chắc chắn, đồng thời hạn chế tình trạng các hạt cao su rơi vào giày khi chơi bóng. 

Gót giày được làm từ vải nhung, mang lại cảm giác ôm chân thoải mái. Đặc biệt, khung bọc gót bên ngoài được thiết kế nhằm làm giảm áp lực tác động lên khu vực gót chân người mang mà không gây ảnh hưởng đến cấu trúc và sự ổn định của đôi giày.

Bộ đệm EVA tạo cảm giác êm ái trong từng pha di chuyển, đồng thời giúp hạn chế phản lực từ bề mặt sân cỏ nhân tạo cứng lên các khớp gối và gót. 

Đế ngoài làm từ chất liệu cao su cao cấp với các đinh dạng Elip lớn nhỏ khác nhau, hỗ trợ khả năng xử lý bóng bằng gầm và tăng cường độ bám sân.

Phù hợp với cầu thủ có thiên hướng rê dắt, kiểm soát và phân phối bóng, sử dụng kỹ thuật. 

Bộ sưu tập: Mad Voltage Pack (10/2024).', N'Còn hàng', CAST(N'2024-11-28T23:02:26.760' AS DateTime), N'ADIDAS', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733200062/txhfraa7pkwg6cdpisie.jpg', 4599000, 464)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (73, N'Giày bóng rổ Nike Jordon 4', 6, N'Thông số kỹ thuật

Nike Jordon 4 là mẫu giày đá banh đế TF dành cho sân cỏ nhân tạo 5-7 người. 

Phân khúc : Academy (tầm trung).

Phần upper làm từ da tổng hợp mềm mại được mô phỏng theo chất liệu sợi dệt sẽ mang đến cảm giác thật chân nhất trong từng pha chạm bóng. Trên bề mặt Phantom Luna 2 Academy TF được trang bị thêm lớp phủ NikeSkin giúp tăng độ bám bóng, từ đó người chơi có thể kiểm soát và rê bóng tốt hơn ở bất kỳ điều kiện thời tiết. 

Công nghệ Strike Zone với các vân vòng tròn được in dập nổi ở những vùng tiếp xúc bóng chủ yếu giúp tăng thêm độ xoáy cho những cú phất bóng và cứa lòng. 

Hệ thống dây giày được thiết kế lệch về phía má ngoài nhằm mở rộng diện tích sút và chuyền bóng.

Phần cổ thun Dynamic Fit được thiết kế theo công nghệ Asym Fit giúp ôm trọn khu vực cổ chân của bạn, tạo cảm giác chắc chắn, đồng thời hạn chế tình trạng các hạt cao su rơi vào giày khi chơi bóng. 

Gót giày được làm từ vải nhung, mang lại cảm giác ôm chân thoải mái. Đặc biệt, khung bọc gót bên ngoài được thiết kế nhằm làm giảm áp lực tác động lên khu vực gót chân người mang mà không gây ảnh hưởng đến cấu trúc và sự ổn định của đôi giày.

Bộ đệm EVA tạo cảm giác êm ái trong từng pha di chuyển, đồng thời giúp hạn chế phản lực từ bề mặt sân cỏ nhân tạo cứng lên các khớp gối và gót. 

Đế ngoài làm từ chất liệu cao su cao cấp với các đinh dạng Elip lớn nhỏ khác nhau, hỗ trợ khả năng xử lý bóng bằng gầm và tăng cường độ bám sân.

Phù hợp với cầu thủ có thiên hướng rê dắt, kiểm soát và phân phối bóng, sử dụng kỹ thuật. 

Bộ sưu tập: Mad Voltage Pack (10/2024).
', N'Còn hàng', CAST(N'2024-11-29T11:09:12.077' AS DateTime), N'Nike', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199796/bzzua2zushe93txoqiky.jpg', 4599000, 150)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (74, N'Vợt Wika Energy đen đỏ', 13, N'– Trọng lượng: 230 ± 10g
– Chất liệu: 100% Carbon Fiber Glass
– Chiều dài – rộng mặt vợt (bao gồm cả cán vợt): 400 x 200 mm
– Độ dày vợt: 14 mm
– Chu vi cán vợt: 108 mm
– Cán vợt: Bề mặt PU', N'Còn hàng', CAST(N'2024-11-29T11:46:43.660' AS DateTime), N'Wika', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733199057/b1vdhal9cdvuvtr6v7ic.jpg', 599000, 1160)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (75, N'Vợt Wika Carbon Pro đen', 13, N'– Trọng lượng: 221 – 232g
– Chất liệu: 100% Carbon T1000
– Chiều dài – rộng (bao gồm cả cán vợt): 419 x 189 mm
– Độ dày vợt: 16 mm
– Chu vi cán vợt: 108 mm
– Bề mặt nhám
– Quấn cán bề mặt PU', N'Còn hàng', CAST(N'2024-11-29T11:49:00.973' AS DateTime), N'Wika', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733196412/g6cn4mdxdxwjawvg7og7.jpg', 1699000, 164)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (76, N'Vợt Wika Gastan', 13, N'– Trọng lượng: 228 ± 10g
– Chất liệu: 100% Carbon T1000
– Chiều dài – rộng (bao gồm cả cán vợt): 420 x 188mm
– Độ dày vợt: 16 mm
– Chu vi cán vợt: 108 mm
– Bề mặt nhám
– Quấn cán bề mặt PU ', N'Còn hàng', CAST(N'2024-11-29T12:22:28.307' AS DateTime), N'Wika', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733194382/fjgqwpaxo9uicoeexse4.jpg', 1699000, 200)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (77, N'Vợt Wika Energy xanh chuối', 13, N'– Trọng lượng: 230 ± 10g
– Chất liệu: 100% Carbon Fiber Glass
– Chiều dài – rộng mặt vợt (bao gồm cả cán vợt): 400 x 200 mm
– Độ dày vợt: 14 mm
– Chu vi cán vợt: 108 mm
– Cán vợt: Bề mặt PU', N'Còn hàng', CAST(N'2024-12-03T10:56:42.663' AS DateTime), N'Wika', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733198204/u7spggsykk38vw5jl8ql.jpg', 599000, 706)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (80, N'Vợt Wika Gastan', 13, N'– Trọng lượng: 228 ± 10g
– Chất liệu: 100% Carbon T1000
– Chiều dài – rộng (bao gồm cả cán vợt): 420 x 188mm
– Độ dày vợt: 16 mm
– Chu vi cán vợt: 108 mm
– Bề mặt nhám
– Quấn cán bề mặt PU ', N'Còn hàng', CAST(N'2024-12-03T12:24:18.840' AS DateTime), N'Wika', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203459/wttt09du2solghzvpugz.jpg', 1699000, 6079)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (81, N'Giày Nike đế gai đinh ', 1, N'Cầu thủ nổi tiếng đại diện: Antony, Varane...

Bộ sưu tập: Energy.

Năm sản xuất: 2023.

Chất liệu: Da công nghệ Ultraweave mới.

Công nghệ: Đế tốc độ cải tiến mới kết hợp bộ đệm êm ái, công nghệ PWRTape giúp phần gót chân chắc chắn và cổ thun sợi dệt cao cấp ôm cổ chân.

Trọng lượng: 247 gram/chiếc (Size 41).

Phong cách: Tấn công, tốc độ.

Vị trí: Tiền vệ cánh, tiền đạo.

Form giày: Phù hợp form chân thon/chân bè.

Mặt sân: Cỏ nhân tạo 5-7 người.', N'Còn hàng', CAST(N'2024-12-03T12:25:56.367' AS DateTime), N'Nike', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203557/yeo6eloytl9zxkud46ef.jpg', 2000000, 200)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (82, N'Giày đá bóng Nike Mercurial Vapor 16 Elite FG Mad Voltage - Volt/Black FQ1457-700', 1, N'Giày đá bóng Nike Mercurial Vapor 16 Elite FG Mad Voltage - Volt/Black FQ1457-700', N'Còn hàng', CAST(N'2024-12-03T12:28:22.083' AS DateTime), N'Nike', N'America', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733203702/rta4jj6dx3eyktxixuz2.jpg', 1699000, 4292)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (83, N'Vợt cầu lông VNB V200 Xanh chính hãng', 3, N'2. Thông số về vợt cầu lông VNB V200 Xanh
- Độ cứng: Trung bình.
- Khung vợt: Carbon High Modulus Graphite Carbon
- Thân vợt: Carbon High Modulus Graphite Carbon
- Trọng lượng: 4U (84+-2gr).

- Điểm cân bằng: 300mm
- Điểm swing weight: 83 kg/cm2 
- Chu vi cán vợt: G5
- Sức căng tối đa: 28-30 LBS
- Màu sắc: Đen/ Xanh dương
- Sản xuất: Trung Quốc.', N'Còn hàng', CAST(N'2024-12-09T15:53:56.270' AS DateTime), N'VNB', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734437/yuty5uu8hgfk5kp6hodf.webp', 529000, 2300)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (84, N'Vợt Victor Auraspeed 90k Metallic', 3, N'Cây vợt nhà sản xuất cho ra mắt 2 phiên bản 3u và 4u

Weight / Grip Size: 3U/G5, 4U/G5

String tension LBS≦ 31 lbs(14kg) ≦ 30 lbs(13.5kg)

Frame Material High Resilience Modulus Graphite+Metallic Carbon Fiber+Nano Fortify TR+

Shaft Material High Resilience Modulus Graphite+PYROFIL+6.8 SHAFT', N'Còn hàng', CAST(N'2024-12-09T15:59:08.090' AS DateTime), N'Victor', N'Trung Quốc', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733734749/dvwxhazjgg44wll0oiik.jpg', 2400000, 3200)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (86, N'Vợt Yonex Nanoflare 1000Z Red Limited 2024 | Phiên bản đặc biệt', 3, N'– Trọng lượng: 4u (~83gr)/G5,
– Độ cứng: Cứng
– Mức căng tối đa: 4U (20-28LBS)
– Khớp nối mới: New Built-in T-Joint
– Khung vợt: HM Graphite, Nanometric DR, M40X, EX-HYPER MG
– Đũa vợt: HM Graphite, Sợi PE siêu bền', N'Còn hàng', CAST(N'2024-12-09T16:11:55.053' AS DateTime), N'Yonex', N'Japan', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733735516/slyy5cw0cjo4b1xutdnf.jpg', 2900000, 4500)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (87, N'Vợt Victor Thruster Ryuga Metallic China Open 2024', 3, N'– Điểm cân bằng: 300mm

– Swing: 87.5 kg/cm2

– Trọng lượng: 83.5g (4U)

– Trọng lượng/Kích thước tay cầm:  3U/G5; 4U/G5

– Độ căng dây LBS: 3U≦ 32 lbs(14,5Kg)
4U≦ 31 lbs(14Kg)

– Vật liệu khung: Graphite Modulus Độ Đàn Hồi Cao + CÔNG NGHỆ LÕI CỨNG + Sợi Carbon Kim Loại

– Vật liệu trục: Graphite Mô đun đàn hồi cao + PYROFIL + TRỤC 6.8', N'Còn hàng', CAST(N'2024-12-09T16:21:07.753' AS DateTime), N'Victor', N'Trung Quốc', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733736069/oegke6uwfs6sfzcvfnhg.jpg', 3500000, 3698)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (88, N'Vợt Cầu Lông Yonex Arcsaber 2 Clear', 3, N'Yonex Arcsaber 2 Clear có trọng lượng 4U, mức trọng lượng trung bình vừa đủ để thực hiện những pha smash uy lực vừa hỗ trợ linh hoạt cho người chơi trong những tình huống xoay chuyển, điều cầu trên lưới. Trọng lượng này sẽ phù hợp với người mới chơi, người có lực cổ tay không quá tốt.', N'Còn hàng', CAST(N'2024-12-09T17:05:59.927' AS DateTime), N'Yonex', N'Japan', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733738761/rhefae9izps6akv2zcxb.webp', 1130000, 5799)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (89, N'Vợt bóng bàn TTR 900 All dùng trong câu lạc bộ', 4, N'Thành phần gồm cốt vợt TTW900 All và mặt vợt TTRB900 All giúp chơi được mọi phong khác khác nhau và đánh thức phẩm chất ngôi sao bóng bàn còn tiềm ẩn.

Vợt bóng bàn TTR 900 All dùng trong câu lạc bộ được thiết kế dành cho người chơi có kinh nghiệm trong thi đấu toàn diện.', N'Còn hàng', CAST(N'2024-12-09T21:25:10.713' AS DateTime), N'729', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754312/u7yeqmpzwsk2ct9tcxud.jpg', 1195000, 800)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (90, N'Vợt bóng bàn TTR 100 3* dùng trong trường học', 4, N'Đối với những buổi tập đầu tiên ở trường hoặc với gia đình, cây vợt bóng bàn này sẽ giúp người chơi áp dụng độ xoáy trong khi vẫn kiểm soát được quỹ đạo bóng.

Vợt bóng bàn TTR 100 3* dùng trong trường học được thiết kế để học thêm độ xoáy bóng bàn trong khi vẫn đảm bảo kiểm soát bóng tốt.', N'Còn hàng', CAST(N'2024-12-09T21:29:14.633' AS DateTime), N'729', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754555/f3ab5hpip888skgdl09n.jpg', 225000, 1000)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (91, N'Vợt bóng bàn tạo xoáy 5* TTR 530', 4, N'Cốt vợt bằng gỗ cứng và lớp cao su dày 2 mm cao cấp, vợt tạo độ nảy cao cho người chơi có phong cách tấn công bằng những cú xoáy bóng.

Vợt bóng bàn tạo xoáy 5* TTR 530 được thiết kế cho những người chơi thường xuyên có phong cách tấn công bằng những đường bóng xoáy.', N'Còn hàng', CAST(N'2024-12-09T21:32:16.187' AS DateTime), N'729', N'Việt Nam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1733754737/mvumyb77xjiyolavcshy.jpg', 725000, 10000)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (92, N'Cốt vợt Banda by STIGA Carbon SF', 4, N'Đặc điểm nổi bật:
Cấu trúc 5+2 carbon cổ điển:

Ứng dụng công nghệ carbon dệt độc đáo SF, kết hợp hai loại sợi đặc biệt để tạo nên sức mạnh tổng hợp tuyệt vời.
Cấu trúc này không chỉ tăng độ ổn định mà còn tối ưu hóa hiệu suất khi thực hiện các pha tấn công và phòng thủ.
Kiểm soát vượt trội:

Được thiết kế để mang lại cảm giác kiểm soát tuyệt vời, ngay cả trong những tình huống khó khăn nhất.
Thích hợp cho các tay vợt chuyên nghiệp đang tìm kiếm sự ổn định và chính xác trong từng đường bóng.
Hợp tác phát triển chuyên sâu:

Được đội ngũ thiết kế và R&D của Banda phát triển với sự tham gia của các vận động viên đội tuyển quốc gia.
Vận động viên nổi tiếng Fang Bo cũng đã chọn Banda Carbon SF làm vũ khí trong các trận đấu đỉnh cao.', N'Còn hàng', CAST(N'2024-12-14T13:55:26.047' AS DateTime), N'Tiga', N'Vietnam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734159329/dd6q7bqoym8qm9qoct6t.png', 2390000, 10197)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (93, N'Vợt bóng bàn Tiga', 4, N'123', N'Còn hàng', CAST(N'2024-12-16T18:40:49.583' AS DateTime), N'Tiga', N'Vietnam', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734363403/xclg8i070hpgq0p4s4cy.jpg', 220200, 303)
INSERT [dbo].[Products] ([Product_Id], [Name], [Category_Product_Id], [Decription], [Status], [Created_Date], [Brand], [Country], [Image], [Price], [Stock]) VALUES (94, N'áo bóng đá', 1, N'123', N'Còn hàng', CAST(N'2024-12-17T13:50:34.950' AS DateTime), N'Nike', N'Mỹ', N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734418235/irwncokl24kq6wfzhvgn.jpg', 300000, 200)
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([Role_Id], [Name]) VALUES (1, N'ROLE_ADMIN')
INSERT [dbo].[Roles] ([Role_Id], [Name]) VALUES (2, N'ROLE_STAFF')
INSERT [dbo].[Roles] ([Role_Id], [Name]) VALUES (3, N'ROLE_OWNER')
INSERT [dbo].[Roles] ([Role_Id], [Name]) VALUES (4, N'ROLE_USER')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Sizes] ON 

INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (1, N'XXL')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (2, N'XL')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (3, N'L')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (4, N'M')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (5, N'S')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (6, N'5U')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (7, N'4U')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (8, N'3U')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (9, N'2U')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (10, N'99U')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (11, N'cc')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (12, N'6.3 - 7.8 ounce')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (13, N'7.9 - 8.2 ounce')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (14, N'8.3 ounce')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (15, N'27 - 28 inch')
INSERT [dbo].[Sizes] ([Size_Id], [Size_Name]) VALUES (16, N'25.7cm')
SET IDENTITY_INSERT [dbo].[Sizes] OFF
GO
SET IDENTITY_INSERT [dbo].[SportFieldDetails] ON 

INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (1, N'Sân 1', 200000, 300000, N'5 người', N'Hoạt động', 2, N'11h00-13h00', 20)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (2, N'Sân 2', 400000, 500000, N'7 người', N'Hoạt động', 2, N'11h00-13h00', 20)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (3, N'Sân 1', 250000, 350000, N'7 người', N'Hoạt động', 3, N'11h00-13h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (4, N'Sân 2', 250000, 350000, N'7 người', N'Hoạt động', 3, N'11h00-13h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (5, N'Sân 3', 250000, 350000, N'7 người', N'Hoạt động', 3, N'11h00-13h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (6, N'Sân 4', 600000, 800000, N'11 người', N'Hoạt động', 3, N'11h00-13h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (7, N'Sân 1', 150000, 270000, N'11 người', N'Hoạt động', 4, N'11h00-12h00', 70)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (8, N'Sân 1', 550000, 700000, N'5 người', N'Hoạt động', 5, N'11h00-13h00', 50)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (9, N'Sân 2', 320000, 400000, N'5 người', N'Hoạt động', 4, N'11h00-12h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (10, N'Sân 5', 600000, 800000, N'11 người', N'Hoạt động', 3, N'11h00-13h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (11, N'Sân 2', 650000, 750000, N'7 người', N'Hoạt động', 5, N'11h00-13h00', 50)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (12, N'Sân 3', 1000000, 1300000, N'11 người', N'Hoạt động', 5, N'17h00-19h00', 80)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (13, N'Sân 3', 300000, 450000, N'7 người', N'Hoạt động', 4, N'10h00-12h30', 40)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (14, N'Sân 1', 100000, 150000, N'5 người', N'Hoạt động', 6, N'10h00-11h00', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (15, N'Sân 2', 150000, 200000, N'7 người', N'Hoạt động', 6, N'11h00-12h00', 50)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (16, N'Sân 3', 200000, 250000, N'11 người', N'Hoạt động', 6, N'11h00-13h00', 60)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (17, N'Sân 1', 200000, 300000, N'5 người', N'Hoạt động', 7, N'10h30-11h30', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (18, N'Sân 4', 200000, 250000, N'7 người', N'Hoạt động', 4, N'11h00-12h00', 50)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (19, N'Sân 5', 300000, 350000, N'7 người', N'Hoạt động', 4, N'10h00-12h00', 70)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (20, N'Sân 4', 250000, 300000, N'5 người', N'Hoạt động', 5, N'11h00-12h00', 70)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (21, N'Sân 1', 150000, 240000, N'7 người', N'Hoạt động', 9, N'19h-20h', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (22, N'Sân 6', 300000, 400000, N'7 người', N'Hoạt động', 4, N'10h00-12h00', 80)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (23, N'Phủi  1', 300000, 400000, N'7 người', N'Hoạt động', 10, N'20h-21h', 20)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (24, N'Phủi 2', 300000, 400000, N'7 người', N'Hoạt động', 10, N'20h-21h', 30)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (25, N'Sân 1', 120000, 150000, N'7 người', N'Hoạt động', 12, N'10h30-12h00', 40)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (26, N'Sân 2', 100000, 120000, N'5 người', N'Hoạt động', 12, N'11h-12h', 40)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (27, N'Sân 1', 100000, 120000, N'5 người', N'Hoạt động', 13, N'10h-12h', 40)
INSERT [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id], [Name], [Price], [Peak_Hour_Prices], [Size], [Status], [Sport_Filed_Id], [Peak_Hour], [Percent_Deposit]) VALUES (28, N'Sân 2', 150000, 200000, N'7 người', N'Hoạt động', 13, N'10h-12h', 50)
SET IDENTITY_INSERT [dbo].[SportFieldDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[SportFields] ON 

INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (2, N'SÂN BÓNG ĐÁ MINI K345', N'A75/6E/65 Bạch Đằng, Phường 02, Quận Tân Bình, Thành phố Hồ Chí Minh', N'6h00', N'23h00', 1, 2, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732866398/iucdmiatb7twsoznxvzq.jpg', N'Tạm đóng', 1, N'Sân bóng K34 chắc hẳn đã không còn xa lạ gì với một số anh em thường xuyên đá phủi, K34 sở hữu cho mình hệ thống gồm 4 sân bóng với 3 sân trong nhà và 1 sân ngoài trời giúp anh em có thể thoải mái chơi bóng không sợ nắng mưa, mặt sân được bảo dưỡng và chăm sóc hàng tuần nên luôn đảm một mặt sân chất lượng để thi đấu.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (3, N'Sân bóng đá mini Chảo Lửa', N'30 Phan Thúc Duyện, Phường 04, Quận Tân Bình, Thành phố Hồ Chí Minh', N'6h00', N'22h00', 1, 5, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732866091/rli5r6vb90koltyr9l0q.jpg', N'Tạm đóng', 1, N'Chảo Lửa SCSC là một hệ thống bao gồm 9 sân ở phía ngoài và 8 sân bên trong khu quân đội, tổng tất cả bao gồm 17 sân bóng đá 5 người. Sân có mặt cỏ được thay thế và bảo trì thường xuyên. Hệ thống đèn chiều sáng đạt chuẩn để thi đấu vào buổi tối.

Cụm sân được sử dụng loại cỏ nhân tạo sợi PE, sợi cỏ mềm, dai, có độ ma sát tốt. Hệ thống thoát nước làm việc hiệu quả giúp sân Chảo Lửa luôn trong tình trạng khô ráo, chống trơn trượt và bảo vệ được độ bền của mặt sân.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (4, N'Sân bóng Akina', N'310 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'7h00', N'23h00', 1, 6, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1730966644/s8w093liaylckqcs64c5.jpg', N'Tạm đóng', 3, N'KHÔNG CÓ GÌ CẢ')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (5, N'Sân vận động mini bình dân', N'310 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành phố Hồ Chí Minh', N'7h00', N'23h00', 1, 4, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732877193/fsteoidwqpmzxszbzwin.jpg', N'Tạm đóng', 3, N'Không có')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (6, N'Sân của Thanh Tú', N'310 Tô Ký, Phường Trung Mỹ Tây, Quận 12, Thành Phố Hồ Chí Minh', N'6h', N'24h', 1, 3, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1731779838/dp5uvwy3wpq97iw3dna7.webp', N'Hoạt động', 6, NULL)
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (7, N'Sân bình dân Quận Tân Bình', N'30 Phan Thúc Duyện, phường 4, quận Tân Bình, Hồ Chí Minh', N'8h', N'22h', 1, 1, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1731922030/lfyuys5ushvdgsxs4zj8.jpg', N'Hoạt động', 11, NULL)
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (9, N'SÂN BÓNG ĐÁ MINI CỎ NHÂN TẠO NGÂN VŨ', N'439/5A Đ. Nguyễn Văn Khối, Phường 8, Quận Gò Vấp, Thành phố Hồ Chí Minh', N'6h00', N'23h00', 1, 1, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732704855/avtzhew9r0dnddthneun.jpg', N'Hoạt động', 13, N'Tại sân có khu căn tin phục vụ chu đáo để bạn thư giãn sau mỗi lần nghỉ giữa hiệp hoặc đơn giản là ngồi cùng mọi người xem những trận đá bóng đang diễn ra trên sân.
Người chơi được cung cấp bóng dùng và nước uống miễn phí cho mỗi trận đấu, những đội quen không cần phải đặt cọc trước mỗi trận đầu.
Sân nhận cáp kèo theo yêu cầu như trình độ, giới tính, tỉ lệ.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (10, N'Sân Bóng Đá Phủi Sài Gòn', N'233 QL13, Phường Hiệp Bình Phước, Quận Thủ Đức, Thành phố Hồ Chí Minh', N'7h00', N'23h00', 1, 2, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732864826/mx3ujrgmb4wy4ichbwrq.jpg', N'Hoạt động', 13, N'Sân bóng đá Phủi Sài Gòn rất đẹp và tiện nghi để các bạn trẻ có thể thỏa sức đam mê bóng đá. Sân được thiết kế theo tiêu chuẩn kích thước của FIFA cho các thể loại 5 người, 7 người và 11 người. Cỏ nhân tạo trên sân được thiết kế chuyên dụng cho bóng đá với độ đàn hồi tốt và không trơn trượt, giúp cho các cầu thủ có thể di chuyển và chạy bóng dễ dàng hơn. Ngoài ra, sân còn được trang bị đầy đủ các tiện ích như hệ thống chiếu sáng, hệ thống thoát nước và khung giá bảo vệ bao quanh sân, giúp cho các cầu thủ chơi bóng trong mọi điều kiện thời tiết và an toàn hơn. Với vị trí thuận tiện và giá cả phải chăng, đây sẽ là một điểm đến lý tưởng cho các bạn trẻ yêu thích bóng đá và muốn tìm kiếm sân chơi phù hợp để thể hiện tài năng của mình.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (11, N'Sân cầu lông LIO SPORT 2', N'242 Đ. Tô Ký, Phường Tân Chánh Hiệp, Quận 12, Thành phố Hồ Chí Minh', N'6h00', N'23h00', 3, 0, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734015007/fkv0ua0voyaqielasigt.jpg', N'Tạm đóng', 37, N'Sân cầu lông LIO SPORT chính thức mở thêm chi nhánh 2 tại số 242 Tô Ký. Với hệ thống 14 sân tiêu chuẩn, hy vọng LIO 2 có thể mang lại cho mọi người một không gian tuyệt vời để luyện tập.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (12, N'Sân bóng Phú Yên', N'123, Phường 7, Thành phố Tuy Hoà, Tỉnh Phú Yên', N'7h00', N'22h00', 1, 2, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734259228/hozehqvlpsydayahbmwg.jpg', N'Tạm đóng', 44, N'Có nước, bãi đỗ xe.')
INSERT [dbo].[SportFields] ([Sport_Field_Id], [Name], [Address], [Opening], [Closing], [Categories_Field_Id], [Quantity], [Image], [Status], [Owner_Id], [Decription]) VALUES (13, N'Sân Tú Thứ 2', N'123, Xã Nậm Ban, Huyện Mèo Vạc, Tỉnh Hà Giang', N'7h00', N'22h00', 1, 2, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734366698/ufo2yzsojydrs8uy0qdy.jpg', N'Hoạt động', 45, N'Không có')
SET IDENTITY_INSERT [dbo].[SportFields] OFF
GO
SET IDENTITY_INSERT [dbo].[StatusSportFieldDetails] ON 

INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (20, 1, CAST(N'2024-11-01T00:00:00.000' AS DateTime), CAST(N'2024-11-26T12:13:10.463' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (21, 2, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (22, 3, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (23, 4, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (24, 5, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (25, 6, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (26, 7, CAST(N'2024-11-01T00:00:00.000' AS DateTime), CAST(N'2024-11-11T00:00:00.000' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (27, 8, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (28, 9, CAST(N'2024-11-01T00:00:00.000' AS DateTime), CAST(N'2024-11-26T14:51:25.557' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (29, 10, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (30, 11, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (31, 12, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (32, 13, CAST(N'2024-11-01T00:00:00.000' AS DateTime), CAST(N'2024-11-30T15:45:42.210' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (33, 14, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (34, 15, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (35, 16, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (36, 17, CAST(N'2024-11-01T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (37, 7, CAST(N'2024-11-11T00:00:00.000' AS DateTime), CAST(N'2024-11-21T12:00:00.000' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (38, 7, CAST(N'2024-11-21T12:00:00.000' AS DateTime), CAST(N'2024-11-25T00:00:00.000' AS DateTime), N'Sửa chữa')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (39, 7, CAST(N'2024-11-25T00:00:00.000' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (40, 18, CAST(N'2024-11-26T01:56:45.393' AS DateTime), CAST(N'2024-11-26T09:06:45.983' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (41, 18, CAST(N'2024-11-26T09:06:45.983' AS DateTime), CAST(N'2024-12-03T15:37:37.317' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (42, 1, CAST(N'2024-11-26T12:13:10.463' AS DateTime), CAST(N'2024-11-26T12:13:42.240' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (43, 1, CAST(N'2024-11-26T12:13:42.240' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (44, 19, CAST(N'2024-11-26T12:18:36.623' AS DateTime), CAST(N'2024-11-29T13:52:55.907' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (45, 20, CAST(N'2024-11-26T12:20:40.323' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (46, 9, CAST(N'2024-11-26T14:51:25.557' AS DateTime), CAST(N'2024-11-26T15:31:36.137' AS DateTime), N'Sửa chữa')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (47, 9, CAST(N'2024-11-26T15:31:36.137' AS DateTime), CAST(N'2024-11-26T15:33:09.667' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (48, 9, CAST(N'2024-11-26T15:33:09.667' AS DateTime), CAST(N'2024-11-26T16:11:03.070' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (49, 9, CAST(N'2024-11-26T16:11:03.070' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (50, 21, CAST(N'2024-11-27T17:57:09.790' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (51, 22, CAST(N'2024-11-29T03:57:40.913' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (52, 19, CAST(N'2024-11-29T13:52:55.907' AS DateTime), CAST(N'2024-11-29T13:53:18.100' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (53, 19, CAST(N'2024-11-29T13:53:18.100' AS DateTime), CAST(N'2024-11-29T13:55:23.940' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (54, 19, CAST(N'2024-11-29T13:55:23.940' AS DateTime), CAST(N'2024-11-29T13:57:31.440' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (55, 19, CAST(N'2024-11-29T13:57:31.440' AS DateTime), CAST(N'2024-11-29T16:18:41.693' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (56, 23, CAST(N'2024-11-29T14:50:37.210' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (57, 24, CAST(N'2024-11-29T14:51:43.050' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (58, 19, CAST(N'2024-11-29T16:18:41.693' AS DateTime), CAST(N'2024-11-29T16:34:53.943' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (59, 19, CAST(N'2024-11-29T16:34:53.943' AS DateTime), CAST(N'2024-12-03T15:36:43.680' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (60, 13, CAST(N'2024-11-30T15:45:42.210' AS DateTime), CAST(N'2024-11-30T15:46:06.200' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (61, 13, CAST(N'2024-11-30T15:46:06.200' AS DateTime), CAST(N'2024-12-01T18:45:19.170' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (62, 13, CAST(N'2024-12-01T18:45:19.170' AS DateTime), CAST(N'2024-12-01T18:45:52.740' AS DateTime), N'Sửa chữa')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (63, 13, CAST(N'2024-12-01T18:45:52.740' AS DateTime), CAST(N'2024-12-03T15:36:39.100' AS DateTime), N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (64, 13, CAST(N'2024-12-03T15:36:39.100' AS DateTime), CAST(N'2024-12-04T15:38:53.487' AS DateTime), N'Tạm đóng')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (65, 19, CAST(N'2024-12-03T15:36:43.680' AS DateTime), CAST(N'2024-12-03T15:37:34.273' AS DateTime), N'Sửa chữa')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (66, 19, CAST(N'2024-12-03T15:37:34.273' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (67, 18, CAST(N'2024-12-03T15:37:37.317' AS DateTime), CAST(N'2024-12-04T15:38:59.847' AS DateTime), N'Sửa chữa')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (68, 13, CAST(N'2024-12-04T15:38:53.487' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (69, 18, CAST(N'2024-12-04T15:38:59.847' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (70, 25, CAST(N'2024-12-15T17:41:41.263' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (71, 26, CAST(N'2024-12-15T17:42:05.927' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (72, 27, CAST(N'2024-12-16T18:07:30.080' AS DateTime), NULL, N'Hoạt động')
INSERT [dbo].[StatusSportFieldDetails] ([Status_Sport_Field_Detail_Id], [Sport_Fiel_Detail_Id], [StartDate], [EndDate], [StatusName]) VALUES (73, 28, CAST(N'2024-12-16T18:08:01.057' AS DateTime), NULL, N'Hoạt động')
SET IDENTITY_INSERT [dbo].[StatusSportFieldDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[SubscriptionPayments] ON 

INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (1, N'nguyentuakina123', 11, 2, 100000, N'Đã thanh toán', CAST(N'2024-11-20T13:09:36.330' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (2, N'nguyentuakina123', 11, 2, 100000, N'Đã thanh toán', CAST(N'2024-11-20T13:09:56.763' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (3, N'nguyentuakina123', 11, 2, 200000, N'Đã thanh toán', CAST(N'2024-11-20T13:11:15.117' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (4, N'nguyentuakina123', 11, 2, 200000, N'Đã thanh toán', CAST(N'2024-11-20T13:12:16.103' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (7, N'nguyentuakina123', 11, 2, 100000, N'Đã thanh toán', CAST(N'2024-11-30T01:56:16.657' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (8, N'myntd', 4, 2, 200000, N'Đã thanh toán', CAST(N'2024-12-02T16:11:29.227' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (9, N'myntd', 4, 1, 200000, N'Đã thanh toán', CAST(N'2024-12-02T16:23:06.750' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (10, N'myntd', 4, 2, 200000, N'Đã thanh toán', CAST(N'2024-12-02T16:28:42.130' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (11, N'myntd', 4, 2, 100000, N'Đã thanh toán', CAST(N'2024-12-02T16:45:38.467' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (12, N'myntd', 4, 2, 200000, N'Đã thanh toán', CAST(N'2024-12-02T16:46:02.190' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (13, N'myntd', 4, 1, 100000, N'Đã thanh toán', CAST(N'2024-12-02T17:01:48.457' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (14, N'myntd', 4, 1, 200000, N'Đã thanh toán', CAST(N'2024-12-02T17:03:37.883' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (16, N'nguyentuakina', 2, 2, 100000, N'Đã thanh toán', CAST(N'2024-12-03T00:14:35.100' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (17, N'nguyentuakina', 2, 1, 200000, N'Đã thanh toán', CAST(N'2024-12-03T00:15:31.220' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (18, N'116043414437118260556', 37, 2, 200000, N'Đã thanh toán', CAST(N'2024-12-03T15:25:53.840' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (19, N'tupy123', 43, 2, 100000, N'Đã thanh toán', CAST(N'2024-12-15T17:43:13.940' AS DateTime), NULL)
INSERT [dbo].[SubscriptionPayments] ([Subscription_Payment_Id], [Username], [User_Subscription_Id], [Payment_Method_Id], [Amount], [Status], [Payment_Date], [Reference_Code]) VALUES (20, N'tuakinapy', 44, 2, 100000, N'Đã thanh toán', CAST(N'2024-12-16T18:13:39.610' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[SubscriptionPayments] OFF
GO
SET IDENTITY_INSERT [dbo].[Transactions] ON 

INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (1, 1, CAST(10000.00 AS Decimal(10, 2)), N'+10000', N'Hoàn tiền từ order 10', CAST(N'2024-11-08T00:00:00.000' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (2, 1, CAST(1323000.00 AS Decimal(10, 2)), N'+1323000', N'Nạp từ hóa đơn: 48', CAST(N'2024-11-11T01:34:47.623' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (3, 1, CAST(1323000.00 AS Decimal(10, 2)), N'-1323000', N'Thanh toán hóa đơn: 48', CAST(N'2024-11-11T01:34:47.627' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (4, 1, CAST(1200000.00 AS Decimal(10, 2)), N'+1200000.0', N'Nạp từ hóa đơn: 61 (MoMo)', CAST(N'2024-11-11T04:03:41.027' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (5, 1, CAST(1200000.00 AS Decimal(10, 2)), N'-1200000.0', N'Thanh toán hóa đơn: 61', CAST(N'2024-11-11T04:03:41.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (6, 1, CAST(1190700.00 AS Decimal(10, 2)), N'+1190700.0', N'Nạp từ hóa đơn: 63 (MoMo)', CAST(N'2024-11-11T16:52:29.753' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (7, 1, CAST(1190700.00 AS Decimal(10, 2)), N'-1190700.0', N'Thanh toán hóa đơn: 63', CAST(N'2024-11-11T16:52:29.760' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (8, 4, CAST(10000.00 AS Decimal(10, 2)), N'+10000', N'Hoàn tiền từ order 10', CAST(N'2024-11-08T00:00:00.000' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (9, 4, CAST(1323000.00 AS Decimal(10, 2)), N'+1323000', N'Nạp từ hóa đơn: 48', CAST(N'2024-11-11T01:34:47.623' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (10, 4, CAST(1323000.00 AS Decimal(10, 2)), N'-1323000', N'Thanh toán hóa đơn: 48', CAST(N'2024-11-11T01:34:47.627' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (11, 4, CAST(1200000.00 AS Decimal(10, 2)), N'+1200000.0', N'Nạp từ hóa đơn: 61 (MoMo)', CAST(N'2024-11-11T04:03:41.027' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (12, 4, CAST(1200000.00 AS Decimal(10, 2)), N'-1200000.0', N'Thanh toán hóa đơn: 61', CAST(N'2024-11-11T04:03:41.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (13, 4, CAST(1190700.00 AS Decimal(10, 2)), N'+1190700.0', N'Nạp từ hóa đơn: 63 (MoMo)', CAST(N'2024-11-11T16:52:29.753' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (14, 4, CAST(1190700.00 AS Decimal(10, 2)), N'-1190700.0', N'Thanh toán hóa đơn: 63', CAST(N'2024-11-11T16:52:29.760' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (15, 4, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Thanh toán cho bookingId: 363', CAST(N'2024-11-14T16:52:33.050' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (16, 4, CAST(4624200.00 AS Decimal(10, 2)), N'-4624200.0', N'Thanh toán cho bookingId: 364', CAST(N'2024-11-14T16:56:26.533' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (19, 11, CAST(0.00 AS Decimal(10, 2)), N'-0.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-14T23:37:28.283' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (20, 4, CAST(3600001.00 AS Decimal(10, 2)), N'+3600001', N'Nạp từ hóa đơn: 66 (VNPay)', CAST(N'2024-11-14T23:44:12.717' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (21, 4, CAST(3600001.00 AS Decimal(10, 2)), N'-3600001', N'Thanh toán hóa đơn: 66', CAST(N'2024-11-14T23:44:12.740' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (22, 4, CAST(3970368.00 AS Decimal(10, 2)), N'+3970368.0', N'Nạp từ hóa đơn: 68 (MoMo)', CAST(N'2024-11-15T03:14:04.283' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (23, 4, CAST(3970368.00 AS Decimal(10, 2)), N'-3970368.0', N'Thanh toán hóa đơn: 68', CAST(N'2024-11-15T03:14:04.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (24, 4, CAST(3600000.00 AS Decimal(10, 2)), N'+3600000.0', N'Nạp từ hóa đơn: 70 (MoMo)', CAST(N'2024-11-15T03:17:36.760' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (25, 4, CAST(3600000.00 AS Decimal(10, 2)), N'-3600000.0', N'Thanh toán hóa đơn: 70', CAST(N'2024-11-15T03:17:36.780' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (26, 4, CAST(3970368.00 AS Decimal(10, 2)), N'+3970368.0', N'Nạp từ hóa đơn: 72 (MoMo)', CAST(N'2024-11-15T03:21:38.433' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (27, 4, CAST(3970368.00 AS Decimal(10, 2)), N'-3970368.0', N'Thanh toán hóa đơn: 72', CAST(N'2024-11-15T03:21:38.447' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (28, 4, CAST(370368.00 AS Decimal(10, 2)), N'+370368.0', N'Nạp từ hóa đơn: 73 (MoMo)', CAST(N'2024-11-15T03:40:22.260' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (29, 4, CAST(370368.00 AS Decimal(10, 2)), N'-370368.0', N'Thanh toán hóa đơn: 73', CAST(N'2024-11-15T03:40:22.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (30, 4, CAST(1200000.00 AS Decimal(10, 2)), N'+1200000.0', N'Nạp từ hóa đơn: 74 (MoMo)', CAST(N'2024-11-15T03:42:51.260' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (31, 4, CAST(1200000.00 AS Decimal(10, 2)), N'-1200000.0', N'Thanh toán hóa đơn: 74', CAST(N'2024-11-15T03:42:51.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (32, 4, CAST(246912.00 AS Decimal(10, 2)), N'+246912.0', N'Nạp từ hóa đơn: 76 (MoMo)', CAST(N'2024-11-15T12:57:58.080' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (33, 4, CAST(246912.00 AS Decimal(10, 2)), N'-246912.0', N'Thanh toán hóa đơn: 76', CAST(N'2024-11-15T12:57:58.113' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (34, 11, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 387', CAST(N'2024-11-15T13:10:43.073' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (35, 3, CAST(135000.00 AS Decimal(10, 2)), N'-135000.0', N'Thanh toán cho bookingId: 388', CAST(N'2024-11-15T13:11:50.233' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (36, 3, CAST(135000.00 AS Decimal(10, 2)), N'-135000.0', N'Thanh toán cho bookingId: 390', CAST(N'2024-11-15T13:16:35.400' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (37, 3, CAST(465000.00 AS Decimal(10, 2)), N'-465000.0', N'Thanh toán cho bookingId: 391', CAST(N'2024-11-15T13:29:50.963' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (38, 3, CAST(450000.00 AS Decimal(10, 2)), N'-450000.0', N'Thanh toán cho bookingId: 393', CAST(N'2024-11-15T13:38:21.353' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (39, 3, CAST(500000.00 AS Decimal(10, 2)), N'-500000.0', N'Thanh toán cho bookingId: 394', CAST(N'2024-11-15T13:38:53.973' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (40, 3, CAST(400000.00 AS Decimal(10, 2)), N'-400000.0', N'Thanh toán cho bookingId: 395', CAST(N'2024-11-15T13:39:14.020' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (41, 3, CAST(1000000.00 AS Decimal(10, 2)), N'-1000000.0', N'Thanh toán cho bookingId: 396', CAST(N'2024-11-15T13:39:31.780' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (42, 3, CAST(1000000.00 AS Decimal(10, 2)), N'-1000000.0', N'Thanh toán cho bookingId: 397', CAST(N'2024-11-15T13:40:20.713' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (43, 3, CAST(500000.00 AS Decimal(10, 2)), N'-500000.0', N'Thanh toán cho bookingId: 398', CAST(N'2024-11-15T13:42:15.113' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (44, 3, CAST(600000.00 AS Decimal(10, 2)), N'+600000.0', N'Nạp từ hóa đơn: 78 (MoMo)', CAST(N'2024-11-15T14:18:26.073' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (45, 3, CAST(600000.00 AS Decimal(10, 2)), N'-600000.0', N'Thanh toán hóa đơn: 78', CAST(N'2024-11-15T14:18:26.107' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (46, 3, CAST(600000.00 AS Decimal(10, 2)), N'+600000', N'Nạp từ hóa đơn: 80 (VNPay)', CAST(N'2024-11-15T14:19:47.290' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (47, 3, CAST(600000.00 AS Decimal(10, 2)), N'-600000', N'Thanh toán hóa đơn: 80', CAST(N'2024-11-15T14:19:47.307' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (48, 3, CAST(123456.00 AS Decimal(10, 2)), N'+123456', N'Nạp từ hóa đơn: 81 (VNPay)', CAST(N'2024-11-15T14:22:44.980' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (49, 3, CAST(123456.00 AS Decimal(10, 2)), N'-123456', N'Thanh toán hóa đơn: 81', CAST(N'2024-11-15T14:22:45.003' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (50, 5, CAST(0.00 AS Decimal(10, 2)), N'-0.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-17T00:55:29.513' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (51, 12, CAST(0.00 AS Decimal(10, 2)), N'-0.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-17T13:33:32.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (52, 11, CAST(6246246.00 AS Decimal(10, 2)), N'-6246246.0', N'Thanh toán hóa đơn: 87', CAST(N'2024-11-20T13:18:11.460' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (53, 11, CAST(6246246.00 AS Decimal(10, 2)), N'+6246246.0', N'Hoàn trả từ hóa đơn: 87', CAST(N'2024-11-20T13:18:52.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (54, 11, CAST(3123123.00 AS Decimal(10, 2)), N'-3123123.0', N'Thanh toán hóa đơn: 88', CAST(N'2024-11-20T13:45:01.363' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (55, 11, CAST(3123123.00 AS Decimal(10, 2)), N'+3123123.0', N'Hoàn trả từ hóa đơn: 88', CAST(N'2024-11-20T13:45:53.383' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (56, 11, CAST(3123123.00 AS Decimal(10, 2)), N'-3123123.0', N'Thanh toán hóa đơn: 89', CAST(N'2024-11-20T13:56:31.347' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (57, 11, CAST(3123123.00 AS Decimal(10, 2)), N'+3123123.0', N'Hoàn trả từ hóa đơn: 89', CAST(N'2024-11-20T13:57:13.350' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (58, 3, CAST(0.00 AS Decimal(10, 2)), N'+0', N'Hoàn tiền từ bookingId: 471', CAST(N'2024-11-20T15:06:01.797' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (59, 4, CAST(0.00 AS Decimal(10, 2)), N'-0', N'Hoàn tiền cho bookingId: 471', CAST(N'2024-11-20T15:06:01.820' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (60, 3, CAST(412500.00 AS Decimal(10, 2)), N'+412500', N'Hoàn tiền từ bookingId: 472', CAST(N'2024-11-20T15:06:41.060' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (61, 4, CAST(412500.00 AS Decimal(10, 2)), N'-412500', N'Hoàn tiền cho bookingId: 472', CAST(N'2024-11-20T15:06:41.083' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (62, 3, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Thanh toán cho bookingId: 473', CAST(N'2024-11-20T15:07:04.470' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (63, 4, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Được thanh toán từ bookingId: 473', CAST(N'2024-11-20T15:07:04.493' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (64, 3, CAST(550000.00 AS Decimal(10, 2)), N'+550000', N'Hoàn tiền từ bookingId: 473', CAST(N'2024-11-20T15:07:29.587' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (65, 4, CAST(550000.00 AS Decimal(10, 2)), N'-550000', N'Hoàn tiền cho bookingId: 473', CAST(N'2024-11-20T15:07:29.590' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (66, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800', N'Hoàn tiền từ bookingId: 474', CAST(N'2024-11-20T15:09:03.040' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (67, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800', N'Hoàn tiền cho bookingId: 474', CAST(N'2024-11-20T15:09:03.053' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (68, 3, CAST(2646000.00 AS Decimal(10, 2)), N'-2646000.0', N'Thanh toán cho bookingId: 475', CAST(N'2024-11-20T15:10:53.180' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (69, 4, CAST(2646000.00 AS Decimal(10, 2)), N'+2646000.0', N'Được thanh toán từ bookingId: 475', CAST(N'2024-11-20T15:10:53.193' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (70, 3, CAST(1852200.00 AS Decimal(10, 2)), N'+1852199.9999999998', N'Hoàn tiền từ bookingId: 475', CAST(N'2024-11-20T15:12:15.017' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (71, 4, CAST(1852200.00 AS Decimal(10, 2)), N'-1852199.9999999998', N'Hoàn tiền cho bookingId: 475', CAST(N'2024-11-20T15:12:15.040' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (72, 3, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 476', CAST(N'2024-11-20T15:15:02.977' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (73, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 476', CAST(N'2024-11-20T15:15:03.003' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (74, 3, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Thanh toán cho bookingId: 477', CAST(N'2024-11-20T15:16:09.647' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (75, 4, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Được thanh toán từ bookingId: 477', CAST(N'2024-11-20T15:16:09.667' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (76, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Hoàn tiền từ bookingId: 477', CAST(N'2024-11-20T15:22:19.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (77, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Hoàn tiền cho bookingId: 477', CAST(N'2024-11-20T15:22:19.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (78, 3, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Thanh toán cho bookingId: 478', CAST(N'2024-11-20T15:34:53.360' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (79, 4, CAST(180000.00 AS Decimal(10, 2)), N'+180000.0', N'Được thanh toán từ bookingId: 478', CAST(N'2024-11-20T15:34:53.387' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (80, 3, CAST(135000.00 AS Decimal(10, 2)), N'+135000.0', N'Hoàn tiền từ bookingId: 478', CAST(N'2024-11-20T15:35:46.960' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (81, 4, CAST(135000.00 AS Decimal(10, 2)), N'-135000.0', N'Hoàn tiền cho bookingId: 478', CAST(N'2024-11-20T15:35:46.977' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (82, 3, CAST(1440000.00 AS Decimal(10, 2)), N'-1440000.0', N'Thanh toán cho bookingId: 479', CAST(N'2024-11-20T15:37:30.737' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (83, 4, CAST(1440000.00 AS Decimal(10, 2)), N'+1440000.0', N'Được thanh toán từ bookingId: 479', CAST(N'2024-11-20T15:37:30.757' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (84, 3, CAST(240000.00 AS Decimal(10, 2)), N'+240000.0', N'Hoàn tiền từ bookingId: 479', CAST(N'2024-11-20T15:39:08.470' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (85, 4, CAST(240000.00 AS Decimal(10, 2)), N'-240000.0', N'Hoàn tiền cho bookingId: 479', CAST(N'2024-11-20T15:39:08.497' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (86, 3, CAST(1200000.00 AS Decimal(10, 2)), N'+1200000.0', N'Hoàn tiền từ bookingId: 479', CAST(N'2024-11-20T15:40:08.840' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (87, 4, CAST(1200000.00 AS Decimal(10, 2)), N'-1200000.0', N'Hoàn tiền cho bookingId: 479', CAST(N'2024-11-20T15:40:08.860' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (88, 3, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Thanh toán cho bookingId: 481', CAST(N'2024-11-20T17:33:47.177' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (89, 4, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Được thanh toán từ bookingId: 481', CAST(N'2024-11-20T17:33:47.203' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (90, 3, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Hoàn tiền từ bookingId: 481', CAST(N'2024-11-20T17:40:52.503' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (91, 4, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Hoàn tiền cho bookingId: 481', CAST(N'2024-11-20T17:40:52.560' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (92, 3, CAST(13750000.00 AS Decimal(10, 2)), N'-1.375E7', N'Thanh toán cho bookingId: 482', CAST(N'2024-11-20T17:41:22.320' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (94, 3, CAST(1375000.00 AS Decimal(10, 2)), N'+1375000.0', N'Hoàn tiền từ bookingId: 482', CAST(N'2024-11-20T20:20:00.180' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (95, 4, CAST(1375000.00 AS Decimal(10, 2)), N'-1375000.0', N'Hoàn tiền cho bookingId: 482', CAST(N'2024-11-20T20:20:00.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (96, 3, CAST(13750000.00 AS Decimal(10, 2)), N'+1.375E7', N'Hoàn tiền từ bookingId: 482', CAST(N'2024-11-20T20:20:41.993' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (97, 4, CAST(13750000.00 AS Decimal(10, 2)), N'-1.375E7', N'Hoàn tiền cho bookingId: 482', CAST(N'2024-11-20T20:20:42.007' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (98, 3, CAST(6600000.00 AS Decimal(10, 2)), N'-6600000.0', N'Thanh toán cho bookingId: 483', CAST(N'2024-11-20T20:24:52.283' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (99, 4, CAST(6600000.00 AS Decimal(10, 2)), N'+6600000.0', N'Được thanh toán từ bookingId: 483', CAST(N'2024-11-20T20:24:52.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (100, 3, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Hoàn tiền từ bookingId: 483', CAST(N'2024-11-20T20:25:25.140' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (101, 4, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Hoàn tiền cho bookingId: 483', CAST(N'2024-11-20T20:25:25.160' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (102, 3, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Hoàn tiền từ bookingId: 483', CAST(N'2024-11-20T20:28:36.677' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (103, 4, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Hoàn tiền cho bookingId: 483', CAST(N'2024-11-20T20:28:36.693' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (104, 3, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000.0', N'Hoàn tiền từ bookingId: 483', CAST(N'2024-11-20T20:29:34.430' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (105, 4, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000.0', N'Hoàn tiền cho bookingId: 483', CAST(N'2024-11-20T20:29:34.450' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (106, 3, CAST(3300000.00 AS Decimal(10, 2)), N'+3300000.0', N'Hoàn tiền từ bookingId: 483', CAST(N'2024-11-20T20:30:03.790' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (107, 4, CAST(3300000.00 AS Decimal(10, 2)), N'-3300000.0', N'Hoàn tiền cho bookingId: 483', CAST(N'2024-11-20T20:30:03.813' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (108, 3, CAST(18144000.00 AS Decimal(10, 2)), N'-1.8144E7', N'Thanh toán cho bookingId: 484', CAST(N'2024-11-20T20:30:34.270' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (109, 4, CAST(18144000.00 AS Decimal(10, 2)), N'+1.8144E7', N'Được thanh toán từ bookingId: 484', CAST(N'2024-11-20T20:30:34.297' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (110, 3, CAST(3024000.00 AS Decimal(10, 2)), N'+3024000.0', N'Hoàn tiền từ bookingId: 484', CAST(N'2024-11-20T20:30:55.370' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (111, 4, CAST(3024000.00 AS Decimal(10, 2)), N'-3024000.0', N'Hoàn tiền cho bookingId: 484', CAST(N'2024-11-20T20:30:55.387' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (112, 3, CAST(15120000.00 AS Decimal(10, 2)), N'+1.512E7', N'Hoàn tiền từ bookingId: 484', CAST(N'2024-11-20T20:31:15.820' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (113, 4, CAST(15120000.00 AS Decimal(10, 2)), N'-1.512E7', N'Hoàn tiền cho bookingId: 484', CAST(N'2024-11-20T20:31:15.857' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (114, 3, CAST(12700800.00 AS Decimal(10, 2)), N'-1.27008E7', N'Thanh toán cho bookingId: 485', CAST(N'2024-11-20T20:31:45.687' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (115, 4, CAST(12700800.00 AS Decimal(10, 2)), N'+1.27008E7', N'Được thanh toán từ bookingId: 485', CAST(N'2024-11-20T20:31:45.700' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (116, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Hoàn tiền từ bookingId: 485', CAST(N'2024-11-20T20:32:48.577' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (117, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Hoàn tiền cho bookingId: 485', CAST(N'2024-11-20T20:32:48.597' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (118, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Hoàn tiền từ bookingId: 461', CAST(N'2024-11-20T20:42:40.403' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (119, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Hoàn tiền cho bookingId: 461', CAST(N'2024-11-20T20:42:40.420' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (120, 4, CAST(1000000.00 AS Decimal(10, 2)), N'+1000000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-20T23:49:22.447' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (121, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-20T23:54:22.653' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (122, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-20T23:54:31.420' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (123, 4, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-20T23:55:21.653' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (124, 11, CAST(5000000.00 AS Decimal(10, 2)), N'+5000000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-20T23:56:01.173' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (125, 11, CAST(3000.00 AS Decimal(10, 2)), N'+3000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-22T14:54:26.840' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (126, 11, CAST(3.00 AS Decimal(10, 2)), N'+3.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-22T14:54:42.467' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (127, 3, CAST(550000.00 AS Decimal(10, 2)), N'-550000.0', N'Thanh toán cho bookingId: 494', CAST(N'2024-11-22T20:39:46.657' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (128, 4, CAST(550000.00 AS Decimal(10, 2)), N'+550000.0', N'Được thanh toán từ bookingId: 494', CAST(N'2024-11-22T20:39:46.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (129, 3, CAST(550000.00 AS Decimal(10, 2)), N'-550000.0', N'Thanh toán cho bookingId: 495', CAST(N'2024-11-22T20:42:11.743' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (130, 4, CAST(550000.00 AS Decimal(10, 2)), N'+550000.0', N'Được thanh toán từ bookingId: 495', CAST(N'2024-11-22T20:42:11.767' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (131, 3, CAST(2268000.00 AS Decimal(10, 2)), N'+2268000', N'Nạp từ hóa đơn đặt sân: 502 (VNPay)', CAST(N'2024-11-23T14:38:45.957' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (132, 3, CAST(2268000.00 AS Decimal(10, 2)), N'-2268000', N'Thanh toán hóa đơn đặt sân: 502', CAST(N'2024-11-23T14:38:45.973' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (133, 3, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600', N'Nạp từ hóa đơn đặt sân: 503 (VNPay)', CAST(N'2024-11-23T14:41:06.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (134, 3, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600', N'Thanh toán hóa đơn đặt sân: 503', CAST(N'2024-11-23T14:41:06.703' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (135, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800', N'Nạp từ hóa đơn đặt sân: 504 (MoMo)', CAST(N'2024-11-23T14:45:16.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (136, 3, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800', N'Thanh toán hóa đơn đặt sân: 504', CAST(N'2024-11-23T14:45:16.283' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (137, 3, CAST(412500.00 AS Decimal(10, 2)), N'+412500', N'Nạp từ hóa đơn đặt sân: 505 (VNPay)', CAST(N'2024-11-23T14:50:40.453' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (138, 3, CAST(412500.00 AS Decimal(10, 2)), N'-412500', N'Thanh toán hóa đơn đặt sân: 505', CAST(N'2024-11-23T14:50:40.467' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (139, 3, CAST(687500.00 AS Decimal(10, 2)), N'+687500', N'Nạp từ hóa đơn đặt sân: 506 (VNPay)', CAST(N'2024-11-23T14:52:50.537' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (140, 3, CAST(687500.00 AS Decimal(10, 2)), N'-687500', N'Thanh toán hóa đơn đặt sân: 506', CAST(N'2024-11-23T14:52:50.550' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (141, 7, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-23T14:55:09.420' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (142, 7, CAST(1.00 AS Decimal(10, 2)), N'+1.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-23T14:56:09.923' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (143, 7, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Thanh toán cho bookingId: 507', CAST(N'2024-11-23T15:05:00.673' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (144, 3, CAST(180000.00 AS Decimal(10, 2)), N'+180000.0', N'Được thanh toán từ bookingId: 507', CAST(N'2024-11-23T15:05:00.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (145, 7, CAST(180000.00 AS Decimal(10, 2)), N'+180000.0', N'Hoàn tiền từ bookingId: 507', CAST(N'2024-11-23T15:05:58.100' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (146, 3, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Hoàn tiền cho bookingId: 507', CAST(N'2024-11-23T15:05:58.120' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (147, 3, CAST(412500.00 AS Decimal(10, 2)), N'-412500.0', N'Thanh toán cho bookingId: 510', CAST(N'2024-11-23T19:12:56.750' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (148, 4, CAST(412500.00 AS Decimal(10, 2)), N'+412500.0', N'Được thanh toán từ bookingId: 510', CAST(N'2024-11-23T19:12:56.773' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (149, 3, CAST(412500.00 AS Decimal(10, 2)), N'+412500.0', N'Hoàn tiền từ bookingId: 510', CAST(N'2024-11-23T19:13:54.820' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (150, 4, CAST(412500.00 AS Decimal(10, 2)), N'-412500.0', N'Hoàn tiền cho bookingId: 510', CAST(N'2024-11-23T19:13:54.843' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (151, 3, CAST(1190700.00 AS Decimal(10, 2)), N'+1190700.0', N'Hoàn tiền từ bookingId: 511', CAST(N'2024-11-23T20:03:57.350' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (152, 4, CAST(1190700.00 AS Decimal(10, 2)), N'-1190700.0', N'Hoàn tiền cho bookingId: 511', CAST(N'2024-11-23T20:03:57.380' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (153, 3, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800', N'Nạp từ hóa đơn đặt sân: 512 (VNPay)', CAST(N'2024-11-23T20:04:28.967' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (154, 3, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800', N'Thanh toán hóa đơn đặt sân: 512', CAST(N'2024-11-23T20:04:28.973' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (155, 4, CAST(20000.00 AS Decimal(10, 2)), N'+20000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-23T21:50:27.593' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (156, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-26T09:27:45.463' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (157, 4, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-26T13:06:36.477' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (158, 4, CAST(20000.00 AS Decimal(10, 2)), N'+20000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-26T14:35:57.767' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (159, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-26T14:37:07.737' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (160, 4, CAST(2498498.00 AS Decimal(10, 2)), N'+2498498', N'Nạp từ hóa đơn: 91 (VNPay)', CAST(N'2024-11-26T15:11:39.110' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (161, 4, CAST(2498498.00 AS Decimal(10, 2)), N'-2498498', N'Thanh toán hóa đơn: 91', CAST(N'2024-11-26T15:11:39.243' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (162, 4, CAST(144000.00 AS Decimal(10, 2)), N'+144000', N'Nạp từ hóa đơn đặt sân: 531 (VNPay)', CAST(N'2024-11-26T16:25:20.190' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (163, 4, CAST(144000.00 AS Decimal(10, 2)), N'-144000', N'Thanh toán hóa đơn đặt sân: 531', CAST(N'2024-11-26T16:25:20.213' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (164, 4, CAST(144000.00 AS Decimal(10, 2)), N'+144000.0', N'Hoàn tiền từ bookingId: 531', CAST(N'2024-11-26T16:27:30.847' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (165, 4, CAST(144000.00 AS Decimal(10, 2)), N'-144000.0', N'Hoàn tiền cho bookingId: 531', CAST(N'2024-11-26T16:27:30.897' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (166, 16, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-27T17:50:50.067' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (167, 16, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-27T17:51:09.057' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (168, 3, CAST(825000.00 AS Decimal(10, 2)), N'-825000.0', N'Thanh toán cho bookingId: 533', CAST(N'2024-11-28T12:38:11.897' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (169, 4, CAST(825000.00 AS Decimal(10, 2)), N'+825000.0', N'Được thanh toán từ bookingId: 533', CAST(N'2024-11-28T12:38:12.060' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (170, 4, CAST(225000.00 AS Decimal(10, 2)), N'-225000.0', N'Thanh toán cho bookingId: 534', CAST(N'2024-11-28T17:47:30.237' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (171, 16, CAST(225000.00 AS Decimal(10, 2)), N'+225000.0', N'Được thanh toán từ bookingId: 534', CAST(N'2024-11-28T17:47:30.427' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (172, 4, CAST(67500.00 AS Decimal(10, 2)), N'-67500.0', N'Thanh toán cho bookingId: 535', CAST(N'2024-11-28T17:47:49.200' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (173, 16, CAST(67500.00 AS Decimal(10, 2)), N'+67500.0', N'Được thanh toán từ bookingId: 535', CAST(N'2024-11-28T17:47:49.367' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (174, 4, CAST(5621621.40 AS Decimal(10, 2)), N'-5621621.4', N'Thanh toán hóa đơn: 92', CAST(N'2024-11-28T17:48:36.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (175, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-28T17:52:40.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (176, 4, CAST(2268000.00 AS Decimal(10, 2)), N'-2268000.0', N'Thanh toán cho bookingId: 540', CAST(N'2024-11-28T18:13:39.800' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (177, 4, CAST(2268000.00 AS Decimal(10, 2)), N'+2268000.0', N'Được thanh toán từ bookingId: 540', CAST(N'2024-11-28T18:13:39.973' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (178, 4, CAST(108000.00 AS Decimal(10, 2)), N'-108000.0', N'Thanh toán cho bookingId: 541', CAST(N'2024-11-28T21:28:54.240' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (179, 3, CAST(108000.00 AS Decimal(10, 2)), N'+108000.0', N'Được thanh toán từ bookingId: 541', CAST(N'2024-11-28T21:28:54.583' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (180, 4, CAST(81000.00 AS Decimal(10, 2)), N'-81000.0', N'Thanh toán cho bookingId: 542', CAST(N'2024-11-28T21:29:04.983' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (181, 3, CAST(81000.00 AS Decimal(10, 2)), N'+81000.0', N'Được thanh toán từ bookingId: 542', CAST(N'2024-11-28T21:29:05.527' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (182, 4, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 543', CAST(N'2024-11-28T21:31:06.587' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (183, 16, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 543', CAST(N'2024-11-28T21:31:08.637' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (184, 4, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 544', CAST(N'2024-11-28T21:31:57.530' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (185, 16, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 544', CAST(N'2024-11-28T21:31:57.863' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (186, 4, CAST(3024000.00 AS Decimal(10, 2)), N'-3024000.0', N'Thanh toán cho bookingId: 545', CAST(N'2024-11-29T03:59:44.087' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (187, 4, CAST(3024000.00 AS Decimal(10, 2)), N'+3024000.0', N'Được thanh toán từ bookingId: 545', CAST(N'2024-11-29T03:59:44.160' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (188, 2, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-29T12:05:58.220' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (189, 2, CAST(500000.00 AS Decimal(10, 2)), N'+500000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-29T12:28:59.447' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (190, 2, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-29T12:29:14.217' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (191, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Thanh toán gói đăng ký từ: chusan', CAST(N'2024-11-29T12:29:14.310' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (192, 2, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-11-29T12:34:20.537' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (193, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Thanh toán gói đăng ký từ: chusan', CAST(N'2024-11-29T12:34:20.607' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (194, 4, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 549', CAST(N'2024-11-29T15:53:32.333' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (195, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 549', CAST(N'2024-11-29T15:53:32.417' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (196, 16, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-11-29T16:29:42.077' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (197, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'100928486128195800698 thanh toán gói Gói nâng cao', CAST(N'2024-11-29T16:29:42.203' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (198, 16, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-11-29T16:34:15.473' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (199, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'100928486128195800698 thanh toán gói Gói nâng cao', CAST(N'2024-11-29T16:34:15.553' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (200, 3, CAST(123456.00 AS Decimal(10, 2)), N'-123456.0', N'Thanh toán hóa đơn: 93', CAST(N'2024-11-29T17:33:35.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (201, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-11-29T17:50:30.310' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (202, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'nguyentuakina thanh toán gói Gói nâng cao', CAST(N'2024-11-29T17:50:30.417' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (203, 4, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 557', CAST(N'2024-11-29T20:33:45.393' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (204, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 557', CAST(N'2024-11-29T20:33:45.583' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (205, 4, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 558', CAST(N'2024-11-29T20:35:52.900' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (206, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 558', CAST(N'2024-11-29T20:35:53.063' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (207, 4, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 559', CAST(N'2024-11-29T20:37:11.397' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (208, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 559', CAST(N'2024-11-29T20:37:11.597' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (209, 4, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 560', CAST(N'2024-11-29T20:39:13.510' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (210, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 560', CAST(N'2024-11-29T20:39:13.683' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (211, 4, CAST(450000.00 AS Decimal(10, 2)), N'-450000.0', N'Thanh toán cho bookingId: 561', CAST(N'2024-11-29T20:40:28.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (212, 2, CAST(450000.00 AS Decimal(10, 2)), N'+450000.0', N'Được thanh toán từ bookingId: 561', CAST(N'2024-11-29T20:40:28.463' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (213, 4, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Thanh toán cho bookingId: 562', CAST(N'2024-11-29T20:42:26.320' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (214, 2, CAST(180000.00 AS Decimal(10, 2)), N'+180000.0', N'Được thanh toán từ bookingId: 562', CAST(N'2024-11-29T20:42:26.483' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (215, 4, CAST(120000.00 AS Decimal(10, 2)), N'-120000.0', N'Thanh toán cho bookingId: 563', CAST(N'2024-11-29T20:43:33.813' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (216, 2, CAST(120000.00 AS Decimal(10, 2)), N'+120000.0', N'Được thanh toán từ bookingId: 563', CAST(N'2024-11-29T20:43:33.980' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (217, 4, CAST(550000.00 AS Decimal(10, 2)), N'-550000.0', N'Thanh toán cho bookingId: 564', CAST(N'2024-11-29T20:45:37.550' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (218, 4, CAST(550000.00 AS Decimal(10, 2)), N'+550000.0', N'Được thanh toán từ bookingId: 564', CAST(N'2024-11-29T20:45:37.707' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (219, 4, CAST(1500000.00 AS Decimal(10, 2)), N'-1500000.0', N'Thanh toán cho bookingId: 565', CAST(N'2024-11-29T20:48:38.800' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (220, 3, CAST(1500000.00 AS Decimal(10, 2)), N'+1500000.0', N'Được thanh toán từ bookingId: 565', CAST(N'2024-11-29T20:48:39.067' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (221, 12, CAST(500000.00 AS Decimal(10, 2)), N'+500000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-11-30T01:57:13.010' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (223, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:12:06.317' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (224, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:13:07.207' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (225, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:13:17.207' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (226, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:16:45.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (227, 12, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:19:49.570' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (228, 12, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:20:02.230' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (229, 12, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-11-30T02:21:10.800' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (230, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'nguyentuakina123 thanh toán gói Gói nâng cao', CAST(N'2024-11-30T02:21:11.223' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (231, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T02:53:56.237' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (232, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T12:25:11.353' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (233, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T12:25:15.933' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (234, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 590', CAST(N'2024-11-30T12:41:37.313' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (235, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 590', CAST(N'2024-11-30T12:41:37.483' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (236, 4, CAST(112500.00 AS Decimal(10, 2)), N'-112500.0', N'Thanh toán cho bookingId: 591', CAST(N'2024-11-30T12:41:46.610' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (237, 3, CAST(112500.00 AS Decimal(10, 2)), N'+112500.0', N'Được thanh toán từ bookingId: 591', CAST(N'2024-11-30T12:41:46.733' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (238, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T12:45:04.540' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (239, 3, CAST(22162161.60 AS Decimal(10, 2)), N'-2.21621616E7', N'Thanh toán hóa đơn: 94', CAST(N'2024-11-30T12:49:15.777' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (240, 3, CAST(6246246.00 AS Decimal(10, 2)), N'-6246246.0', N'Thanh toán hóa đơn: 95', CAST(N'2024-11-30T12:50:18.957' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (243, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T12:53:41.300' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (244, 4, CAST(370368.00 AS Decimal(10, 2)), N'-370368.0', N'Thanh toán hóa đơn: 96', CAST(N'2024-11-30T12:54:20.977' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (245, 4, CAST(370368.00 AS Decimal(10, 2)), N'+370368.0', N'Hoàn trả từ hóa đơn: 96', CAST(N'2024-11-30T12:55:38.110' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (246, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 595', CAST(N'2024-11-30T12:56:56.707' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (247, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 595', CAST(N'2024-11-30T12:56:56.860' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (248, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Hoàn tiền từ bookingId: 595', CAST(N'2024-11-30T12:57:23.193' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (249, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Hoàn tiền cho bookingId: 595', CAST(N'2024-11-30T12:57:23.450' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (250, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:32:43.033' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (252, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:34:07.200' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (254, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:35:09.597' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (255, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:35:10.077' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (256, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:36:04.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (257, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:36:04.580' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (258, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:38:01.250' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (259, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T13:38:01.823' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (260, 7, CAST(240000.00 AS Decimal(10, 2)), N'-240000.0', N'Thanh toán cho bookingId: 598', CAST(N'2024-11-30T15:31:25.123' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (261, 4, CAST(240000.00 AS Decimal(10, 2)), N'+240000.0', N'Được thanh toán từ bookingId: 598', CAST(N'2024-11-30T15:31:25.220' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (262, 7, CAST(240000.00 AS Decimal(10, 2)), N'+240000.0', N'Hoàn tiền từ bookingId: 598', CAST(N'2024-11-30T15:32:41.930' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (263, 4, CAST(240000.00 AS Decimal(10, 2)), N'-240000.0', N'Hoàn tiền cho bookingId: 598', CAST(N'2024-11-30T15:32:42.153' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (264, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-11-30T15:43:31.913' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (265, 4, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 601', CAST(N'2024-11-30T15:44:44.367' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (266, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 601', CAST(N'2024-11-30T15:44:44.563' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (267, 4, CAST(112500.00 AS Decimal(10, 2)), N'-112500.0', N'Thanh toán cho bookingId: 602', CAST(N'2024-11-30T15:51:27.610' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (268, 3, CAST(112500.00 AS Decimal(10, 2)), N'+112500.0', N'Được thanh toán từ bookingId: 602', CAST(N'2024-11-30T15:51:27.803' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (269, 4, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 605', CAST(N'2024-12-01T12:49:27.513' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (270, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 605', CAST(N'2024-12-01T12:49:27.997' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (271, 4, CAST(1080000.00 AS Decimal(10, 2)), N'-1080000.0', N'Thanh toán cho bookingId: 606', CAST(N'2024-12-01T12:49:58.907' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (272, 4, CAST(1080000.00 AS Decimal(10, 2)), N'+1080000.0', N'Được thanh toán từ bookingId: 606', CAST(N'2024-12-01T12:49:58.977' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (273, 4, CAST(493824.00 AS Decimal(10, 2)), N'-493824.0', N'Thanh toán hóa đơn: 108', CAST(N'2024-12-01T15:38:13.473' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (274, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 614', CAST(N'2024-12-02T13:26:30.867' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (275, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 614', CAST(N'2024-12-02T13:26:31.013' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (276, 11, CAST(90000.00 AS Decimal(10, 2)), N'-90000.0', N'Thanh toán cho bookingId: 618', CAST(N'2024-12-02T15:12:31.580' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (277, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000.0', N'Được thanh toán từ bookingId: 618', CAST(N'2024-12-02T15:12:31.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (278, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000', N'Nạp từ hóa đơn: 119 (VNPay)', CAST(N'2024-12-02T15:30:15.380' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (279, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000', N'Thanh toán hóa đơn: 119', CAST(N'2024-12-02T15:30:15.507' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (280, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Nạp từ hóa đơn: 121 (MoMo)', CAST(N'2024-12-02T15:35:00.740' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (281, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán hóa đơn: 121', CAST(N'2024-12-02T15:35:00.793' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (282, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán hóa đơn: 122', CAST(N'2024-12-02T15:35:21.010' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (283, 4, CAST(24624624.00 AS Decimal(10, 2)), N'-2.4624624E7', N'Thanh toán hóa đơn: 123', CAST(N'2024-12-02T15:36:31.363' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (284, 16, CAST(1000000.00 AS Decimal(10, 2)), N'+1000000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-02T15:45:26.803' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (285, 16, CAST(400000.00 AS Decimal(10, 2)), N'-400000.0', N'Thanh toán hóa đơn: 125', CAST(N'2024-12-02T15:46:46.070' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (286, 3, CAST(400000.00 AS Decimal(10, 2)), N'+400000.0', N'Từ hóa đơn: 125', CAST(N'2024-12-02T15:46:46.147' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (287, 16, CAST(400000.00 AS Decimal(10, 2)), N'+400000.0', N'Hoàn trả từ hóa đơn: 125', CAST(N'2024-12-02T15:47:50.747' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (288, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-12-02T16:11:29.513' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (289, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-12-02T16:23:28.540' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (290, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Gia hạn gói gói nâng cao từ: myntd', CAST(N'2024-12-02T16:23:28.630' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (291, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-12-02T17:10:36.633' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (292, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'nguyentuakina thanh toán gói Gói nâng cao', CAST(N'2024-12-02T17:10:36.723' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (293, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Gia hạn gói đăng ký!', CAST(N'2024-12-02T17:11:22.590' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (294, 4, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gia hạn gói tài khoản: Gói cơ bản', CAST(N'2024-12-02T18:56:04.730' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (295, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'nguyentuakina thanh toán gói Gói cơ bản', CAST(N'2024-12-02T18:56:05.127' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (296, 4, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gia hạn gói tài khoản: Gói cơ bản', CAST(N'2024-12-02T19:00:27.453' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (297, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'nguyentuakina thanh toán gói Gói cơ bản', CAST(N'2024-12-02T19:00:27.810' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (298, 7, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:37:40.947' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (299, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:37:41.850' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (300, 7, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:39:05.567' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (301, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:39:05.937' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (302, 7, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:43:20.373' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (303, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:43:20.587' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (304, 7, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:46:40.790' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (305, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:46:40.997' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (306, 7, CAST(0.00 AS Decimal(10, 2)), N'-0.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:57:15.530' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (307, 3, CAST(0.00 AS Decimal(10, 2)), N'+0.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:57:16.110' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (308, 7, CAST(0.00 AS Decimal(10, 2)), N'-0.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-02T22:59:51.507' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (309, 3, CAST(0.00 AS Decimal(10, 2)), N'+0.0', N'phihung đăng ký trở thành chủ sân', CAST(N'2024-12-02T22:59:52.783' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (310, 7, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600', N'Nạp từ hóa đơn đặt sân: 619 (MoMo)', CAST(N'2024-12-03T00:06:53.753' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (311, 7, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600', N'Thanh toán hóa đơn đặt sân: 619', CAST(N'2024-12-03T00:06:53.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (312, 7, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600', N'Nạp từ hóa đơn đặt sân: 620 (VNPay)', CAST(N'2024-12-03T00:08:20.213' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (313, 7, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600', N'Thanh toán hóa đơn đặt sân: 620', CAST(N'2024-12-03T00:08:20.453' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (314, 4, CAST(24624624.00 AS Decimal(10, 2)), N'+24624624', N'Nạp từ hóa đơn: 129 (VNPay)', CAST(N'2024-12-03T00:09:20.133' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (315, 4, CAST(24624624.00 AS Decimal(10, 2)), N'-24624624', N'Thanh toán hóa đơn: 129', CAST(N'2024-12-03T00:09:20.590' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (316, 4, CAST(360000.00 AS Decimal(10, 2)), N'+360000.0', N'Nạp từ hóa đơn: 130 (MoMo)', CAST(N'2024-12-03T00:10:22.093' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (317, 4, CAST(360000.00 AS Decimal(10, 2)), N'-360000.0', N'Thanh toán hóa đơn: 130', CAST(N'2024-12-03T00:10:22.553' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (318, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-03T01:55:28.633' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (319, 9, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-03T12:56:38.367' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (320, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'tufpt đăng ký trở thành chủ sân', CAST(N'2024-12-03T12:56:38.607' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (321, 9, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-03T12:59:56.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (322, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'tufpt đăng ký trở thành chủ sân', CAST(N'2024-12-03T12:59:57.153' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (323, 9, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-03T13:02:16.917' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (324, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'tufpt đăng ký trở thành chủ sân', CAST(N'2024-12-03T13:02:17.087' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (325, 9, CAST(100000.00 AS Decimal(10, 2)), N'-100000.0', N'Thanh toán gói đăng ký trở thành chủ sân!', CAST(N'2024-12-03T13:05:35.330' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (326, 3, CAST(100000.00 AS Decimal(10, 2)), N'+100000.0', N'tufpt đăng ký trở thành chủ sân', CAST(N'2024-12-03T13:05:35.483' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (327, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán cho bookingId: 635', CAST(N'2024-12-03T15:52:17.893' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (328, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Được thanh toán từ bookingId: 635', CAST(N'2024-12-03T15:52:17.937' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (329, 4, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 636', CAST(N'2024-12-03T15:55:05.357' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (330, 3, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 636', CAST(N'2024-12-03T15:55:05.397' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (331, 4, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Hoàn tiền từ bookingId: 636', CAST(N'2024-12-03T16:07:03.010' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (332, 3, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Hoàn tiền cho bookingId: 636', CAST(N'2024-12-03T16:07:03.097' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (333, 7, CAST(10000000.00 AS Decimal(10, 2)), N'+1.0E7', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-03T16:21:25.357' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (334, 7, CAST(5660100.00 AS Decimal(10, 2)), N'-5660100.0', N'Thanh toán hóa đơn: 131', CAST(N'2024-12-03T16:25:22.567' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (335, 7, CAST(1690000.00 AS Decimal(10, 2)), N'-1690000.0', N'Thanh toán hóa đơn: 132', CAST(N'2024-12-03T16:26:10.020' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (336, 7, CAST(1690000.00 AS Decimal(10, 2)), N'+1690000.0', N'Hoàn trả từ hóa đơn: 133', CAST(N'2024-12-03T16:27:05.783' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (337, 7, CAST(1690000.00 AS Decimal(10, 2)), N'+1690000', N'Nạp từ hóa đơn: 135 (VNPay)', CAST(N'2024-12-03T16:28:40.693' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (338, 7, CAST(1690000.00 AS Decimal(10, 2)), N'-1690000', N'Thanh toán hóa đơn: 135', CAST(N'2024-12-03T16:28:40.747' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (339, 2, CAST(5000000.00 AS Decimal(10, 2)), N'+5000000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-04T14:10:26.207' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (340, 2, CAST(3487000.00 AS Decimal(10, 2)), N'-3487000.0', N'Thanh toán hóa đơn: 138', CAST(N'2024-12-04T14:10:48.533' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (341, 2, CAST(3487000.00 AS Decimal(10, 2)), N'-3487000.0', N'Thanh toán hóa đơn: 139', CAST(N'2024-12-04T14:15:30.613' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (342, 2, CAST(3487000.00 AS Decimal(10, 2)), N'-3487000.0', N'Thanh toán hóa đơn: 140', CAST(N'2024-12-04T14:20:22.280' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (343, 16, CAST(400000.00 AS Decimal(10, 2)), N'-400000.0', N'Thanh toán hóa đơn: 141', CAST(N'2024-12-04T14:33:03.247' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (344, 3, CAST(400000.00 AS Decimal(10, 2)), N'+400000.0', N'Từ hóa đơn: 141', CAST(N'2024-12-04T14:33:03.300' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (345, 16, CAST(3400000.00 AS Decimal(10, 2)), N'-3400000.0', N'Thanh toán hóa đơn: 142', CAST(N'2024-12-04T14:35:31.010' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (346, 16, CAST(3400000.00 AS Decimal(10, 2)), N'-3400000.0', N'Thanh toán hóa đơn: 143', CAST(N'2024-12-04T14:40:33.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (347, 16, CAST(3400000.00 AS Decimal(10, 2)), N'-3400000.0', N'Thanh toán hóa đơn: 144', CAST(N'2024-12-04T14:44:30.583' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (348, 3, CAST(3400000.00 AS Decimal(10, 2)), N'+3400000.0', N'Từ hóa đơn: 144', CAST(N'2024-12-04T14:44:30.663' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (349, 16, CAST(15900000.00 AS Decimal(10, 2)), N'-1.59E7', N'Thanh toán hóa đơn: 145', CAST(N'2024-12-04T14:45:58.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (350, 3, CAST(15900000.00 AS Decimal(10, 2)), N'+1.59E+7', N'Từ hóa đơn: 145', CAST(N'2024-12-04T14:45:58.373' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (351, 16, CAST(15900000.00 AS Decimal(10, 2)), N'-1.59E7', N'Thanh toán hóa đơn: 146', CAST(N'2024-12-04T14:46:29.887' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (352, 3, CAST(15900000.00 AS Decimal(10, 2)), N'+1.59E+7', N'Từ hóa đơn: 146', CAST(N'2024-12-04T14:46:29.950' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (353, 16, CAST(15900000.00 AS Decimal(10, 2)), N'+1.59E7', N'Hoàn trả từ hóa đơn: 146', CAST(N'2024-12-04T14:46:41.137' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (354, 16, CAST(15900000.00 AS Decimal(10, 2)), N'-1.59E7', N'Thanh toán hóa đơn: 147', CAST(N'2024-12-04T14:51:38.450' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (355, 3, CAST(15900000.00 AS Decimal(10, 2)), N'+1.59E+7', N'Từ hóa đơn: 147', CAST(N'2024-12-04T14:51:38.510' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (356, 16, CAST(15900000.00 AS Decimal(10, 2)), N'+1.59E7', N'Hoàn trả từ hóa đơn: 147', CAST(N'2024-12-04T14:51:53.760' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (357, 3, CAST(15900000.00 AS Decimal(10, 2)), N'-1.59E7', N'Hoàn trả cho hóa đơn (khách hủy): 147', CAST(N'2024-12-04T14:51:53.843' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (358, 4, CAST(412500.00 AS Decimal(10, 2)), N'-412500.0', N'Thanh toán cho bookingId: 646', CAST(N'2024-12-04T15:54:28.350' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (359, 4, CAST(412500.00 AS Decimal(10, 2)), N'+412500.0', N'Được thanh toán từ bookingId: 646', CAST(N'2024-12-04T15:54:28.563' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (360, 4, CAST(1100000.00 AS Decimal(10, 2)), N'+1100000', N'Nạp từ hóa đơn đặt sân: 647 (VNPay)', CAST(N'2024-12-04T15:55:09.290' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (361, 4, CAST(1100000.00 AS Decimal(10, 2)), N'-1100000', N'Thanh toán hóa đơn đặt sân: 647', CAST(N'2024-12-04T15:55:09.423' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (362, 4, CAST(1320000.00 AS Decimal(10, 2)), N'-1320000.0', N'Thanh toán cho bookingId: 648', CAST(N'2024-12-04T15:55:33.670' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (363, 4, CAST(1320000.00 AS Decimal(10, 2)), N'+1320000.0', N'Được thanh toán từ bookingId: 648', CAST(N'2024-12-04T15:55:33.843' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (364, 7, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 649', CAST(N'2024-12-04T15:56:06.120' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (365, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 649', CAST(N'2024-12-04T15:56:06.293' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (366, 7, CAST(315000.00 AS Decimal(10, 2)), N'-315000.0', N'Thanh toán cho bookingId: 650', CAST(N'2024-12-04T15:56:30.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (367, 4, CAST(315000.00 AS Decimal(10, 2)), N'+315000.0', N'Được thanh toán từ bookingId: 650', CAST(N'2024-12-04T15:56:30.933' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (368, 3, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 651', CAST(N'2024-12-04T15:57:11.543' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (369, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 651', CAST(N'2024-12-04T15:57:11.743' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (370, 3, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 652', CAST(N'2024-12-04T15:57:38.280' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (371, 4, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 652', CAST(N'2024-12-04T15:57:38.443' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (372, 3, CAST(600000.00 AS Decimal(10, 2)), N'-600000.0', N'Thanh toán cho bookingId: 653', CAST(N'2024-12-04T15:57:52.213' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (373, 4, CAST(600000.00 AS Decimal(10, 2)), N'+600000.0', N'Được thanh toán từ bookingId: 653', CAST(N'2024-12-04T15:57:52.540' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (374, 3, CAST(600000.00 AS Decimal(10, 2)), N'-600000.0', N'Thanh toán cho bookingId: 654', CAST(N'2024-12-04T15:58:06.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (375, 4, CAST(600000.00 AS Decimal(10, 2)), N'+600000.0', N'Được thanh toán từ bookingId: 654', CAST(N'2024-12-04T15:58:06.477' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (376, 4, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 665', CAST(N'2024-12-04T17:28:53.777' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (377, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 665', CAST(N'2024-12-04T17:28:53.960' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (378, 2, CAST(3487000.00 AS Decimal(10, 2)), N'-3487000.0', N'Thanh toán hóa đơn: 180', CAST(N'2024-12-04T18:10:46.700' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (379, 3, CAST(3487000.00 AS Decimal(10, 2)), N'+3487000.0', N'Từ hóa đơn: 180', CAST(N'2024-12-04T18:10:46.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (380, 3, CAST(1690000.00 AS Decimal(10, 2)), N'+1690000.0', N'Hoàn trả từ hóa đơn: 181', CAST(N'2024-12-04T18:21:37.757' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (381, 3, CAST(1690000.00 AS Decimal(10, 2)), N'+1690000.0', N'Nạp từ hóa đơn: 183 (MoMo)', CAST(N'2024-12-04T18:30:34.133' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (382, 3, CAST(1690000.00 AS Decimal(10, 2)), N'-1690000.0', N'Thanh toán hóa đơn: 183', CAST(N'2024-12-04T18:30:34.193' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (383, 3, CAST(1690000.00 AS Decimal(10, 2)), N'-1690000.0', N'Thanh toán hóa đơn: 185', CAST(N'2024-12-04T18:42:04.973' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (384, 3, CAST(1690000.00 AS Decimal(10, 2)), N'+1690000.0', N'Từ hóa đơn: 185', CAST(N'2024-12-04T18:42:05.040' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (385, 16, CAST(20000.00 AS Decimal(10, 2)), N'+20000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-04T19:36:08.577' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (386, 4, CAST(18396000.00 AS Decimal(10, 2)), N'-1.8396E7', N'Thanh toán hóa đơn: 188', CAST(N'2024-12-04T19:46:35.413' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (387, 3, CAST(18396000.00 AS Decimal(10, 2)), N'+1.8396E+7', N'Từ hóa đơn: 188', CAST(N'2024-12-04T19:46:35.890' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (388, 4, CAST(18396000.00 AS Decimal(10, 2)), N'+1.8396E7', N'Hoàn trả từ hóa đơn: 188', CAST(N'2024-12-04T19:47:02.877' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (389, 3, CAST(18396000.00 AS Decimal(10, 2)), N'-1.8396E7', N'Hoàn trả cho hóa đơn (khách hủy): 188', CAST(N'2024-12-04T19:47:03.437' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (390, 9, CAST(9298000.00 AS Decimal(10, 2)), N'+9298000', N'Nạp từ hóa đơn: 189 (VNPay)', CAST(N'2024-12-04T19:57:13.857' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (391, 9, CAST(9298000.00 AS Decimal(10, 2)), N'-9298000', N'Thanh toán hóa đơn: 189', CAST(N'2024-12-04T19:57:14.117' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (392, 4, CAST(80000.00 AS Decimal(10, 2)), N'+80000', N'Nạp từ hóa đơn đặt sân: 667 (VNPay)', CAST(N'2024-12-04T22:46:46.583' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (393, 4, CAST(80000.00 AS Decimal(10, 2)), N'-80000', N'Thanh toán hóa đơn đặt sân: 667', CAST(N'2024-12-04T22:46:46.730' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (394, 4, CAST(500000.00 AS Decimal(10, 2)), N'+500000', N'Nạp từ hóa đơn đặt sân: 668 (MoMo)', CAST(N'2024-12-04T22:48:12.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (395, 4, CAST(500000.00 AS Decimal(10, 2)), N'-500000', N'Thanh toán hóa đơn đặt sân: 668', CAST(N'2024-12-04T22:48:13.140' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (396, 3, CAST(412500.00 AS Decimal(10, 2)), N'-412500.0', N'Thanh toán cho bookingId: 669', CAST(N'2024-12-05T00:03:05.767' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (397, 4, CAST(412500.00 AS Decimal(10, 2)), N'+412500.0', N'Được thanh toán từ bookingId: 669', CAST(N'2024-12-05T00:03:05.830' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (398, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 671', CAST(N'2024-12-07T04:08:30.223' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (399, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 671', CAST(N'2024-12-07T04:08:30.253' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (400, 4, CAST(112500.00 AS Decimal(10, 2)), N'-112500.0', N'Thanh toán cho bookingId: 672', CAST(N'2024-12-07T04:08:40.507' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (401, 3, CAST(112500.00 AS Decimal(10, 2)), N'+112500.0', N'Được thanh toán từ bookingId: 672', CAST(N'2024-12-07T04:08:40.507' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (402, 4, CAST(1587600.00 AS Decimal(10, 2)), N'-1587600.0', N'Thanh toán cho bookingId: 673', CAST(N'2024-12-07T04:09:05.800' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (403, 4, CAST(1587600.00 AS Decimal(10, 2)), N'+1587600.0', N'Được thanh toán từ bookingId: 673', CAST(N'2024-12-07T04:09:05.813' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (404, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Thanh toán cho bookingId: 674', CAST(N'2024-12-07T04:09:11.397' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (405, 4, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Được thanh toán từ bookingId: 674', CAST(N'2024-12-07T04:09:11.413' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (406, 4, CAST(2116800.00 AS Decimal(10, 2)), N'-2116800.0', N'Thanh toán cho bookingId: 675', CAST(N'2024-12-07T04:09:18.080' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (407, 4, CAST(2116800.00 AS Decimal(10, 2)), N'+2116800.0', N'Được thanh toán từ bookingId: 675', CAST(N'2024-12-07T04:09:18.097' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (408, 4, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán cho bookingId: 676', CAST(N'2024-12-07T04:09:24.543' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (409, 4, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Được thanh toán từ bookingId: 676', CAST(N'2024-12-07T04:09:24.573' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (410, 4, CAST(360000.00 AS Decimal(10, 2)), N'-360000.0', N'Thanh toán cho bookingId: 677', CAST(N'2024-12-07T04:09:37.407' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (411, 4, CAST(360000.00 AS Decimal(10, 2)), N'+360000.0', N'Được thanh toán từ bookingId: 677', CAST(N'2024-12-07T04:09:37.423' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (412, 16, CAST(200000.00 AS Decimal(10, 2)), N'+200000', N'Nạp từ hóa đơn thanh toán bằng:  (MoMo)', CAST(N'2024-12-08T03:19:52.493' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (413, 16, CAST(200000.00 AS Decimal(10, 2)), N'-200000', N'Thanh toán hóa đơn: ', CAST(N'2024-12-08T03:19:52.523' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (414, 16, CAST(12700000.00 AS Decimal(10, 2)), N'+12700000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-08T03:27:12.600' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (415, 16, CAST(12700000.00 AS Decimal(10, 2)), N'-12700000', N'Thanh toán hóa đơn ', CAST(N'2024-12-08T03:27:12.630' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (416, 16, CAST(12700000.00 AS Decimal(10, 2)), N'+1.27E7', N'Hoàn trả từ hóa đơn: 209', CAST(N'2024-12-08T03:28:13.050' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (417, 16, CAST(45000.00 AS Decimal(10, 2)), N'-45000.0', N'Thanh toán cho bookingId: 694', CAST(N'2024-12-09T01:39:46.490' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (418, 16, CAST(45000.00 AS Decimal(10, 2)), N'+45000.0', N'Được thanh toán từ bookingId: 694', CAST(N'2024-12-09T01:39:46.543' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (419, 2, CAST(67500.00 AS Decimal(10, 2)), N'+67500', N'Nạp từ hóa đơn đặt sân: null (VNPay)', CAST(N'2024-12-09T02:36:57.690' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (420, 2, CAST(67500.00 AS Decimal(10, 2)), N'-67500', N'Thanh toán hóa đơn đặt sân: null', CAST(N'2024-12-09T02:36:57.723' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (421, 2, CAST(450000.00 AS Decimal(10, 2)), N'-450000.0', N'Thanh toán cho bookingId: 696', CAST(N'2024-12-09T02:39:45.897' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (422, 16, CAST(450000.00 AS Decimal(10, 2)), N'+450000.0', N'Được thanh toán từ bookingId: 696', CAST(N'2024-12-09T02:39:45.940' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (423, 2, CAST(45000.00 AS Decimal(10, 2)), N'-45000.0', N'Thanh toán cho bookingId: 697', CAST(N'2024-12-09T02:44:55.233' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (424, 16, CAST(45000.00 AS Decimal(10, 2)), N'+45000.0', N'Được thanh toán từ bookingId: 697', CAST(N'2024-12-09T02:44:55.270' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (425, 2, CAST(450000.00 AS Decimal(10, 2)), N'+450000.0', N'Hoàn tiền từ bookingId: 696', CAST(N'2024-12-09T02:47:42.243' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (426, 16, CAST(450000.00 AS Decimal(10, 2)), N'-450000.0', N'Hoàn tiền cho bookingId: 696', CAST(N'2024-12-09T02:47:42.300' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (427, 2, CAST(45000.00 AS Decimal(10, 2)), N'+45000.0', N'Hoàn tiền từ bookingId: 697', CAST(N'2024-12-09T02:47:44.187' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (428, 16, CAST(45000.00 AS Decimal(10, 2)), N'-45000.0', N'Hoàn tiền cho bookingId: 697', CAST(N'2024-12-09T02:47:44.233' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (429, 2, CAST(225000.00 AS Decimal(10, 2)), N'+225000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T02:50:27.523' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (430, 2, CAST(225000.00 AS Decimal(10, 2)), N'-225000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T02:50:27.553' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (431, 2, CAST(90000.00 AS Decimal(10, 2)), N'+90000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:16:05.103' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (432, 2, CAST(90000.00 AS Decimal(10, 2)), N'-90000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:16:05.137' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (433, 2, CAST(45000.00 AS Decimal(10, 2)), N'+45000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:22:30.807' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (434, 2, CAST(45000.00 AS Decimal(10, 2)), N'-45000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:22:30.843' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (435, 2, CAST(45000.00 AS Decimal(10, 2)), N'+45000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T03:29:18.233' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (436, 2, CAST(45000.00 AS Decimal(10, 2)), N'-45000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T03:29:18.257' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (437, 2, CAST(45000.00 AS Decimal(10, 2)), N'+45000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:30:42.017' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (438, 2, CAST(45000.00 AS Decimal(10, 2)), N'-45000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:30:42.040' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (439, 2, CAST(120000.00 AS Decimal(10, 2)), N'+120000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:40:49.020' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (440, 2, CAST(120000.00 AS Decimal(10, 2)), N'-120000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:40:49.047' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (441, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:45:19.127' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (442, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:45:19.157' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (443, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:46:59.520' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (444, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:46:59.553' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (445, 2, CAST(120000.00 AS Decimal(10, 2)), N'+120000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:51:42.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (446, 2, CAST(120000.00 AS Decimal(10, 2)), N'-120000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:51:42.797' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (447, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:56:37.883' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (448, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T03:56:37.913' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (449, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:01:01.803' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (450, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:01:01.827' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (451, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:02:59.957' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (452, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:02:59.980' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (453, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:08:37.110' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (454, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:08:37.137' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (455, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:15:31.820' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (456, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:15:31.853' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (457, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:31:42.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (458, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:31:42.720' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (459, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:44:54.150' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (460, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:44:54.180' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (461, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:46:29.880' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (462, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:46:29.913' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (463, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:50:24.007' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (464, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:50:24.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (465, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:52:16.827' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (466, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:52:16.983' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (467, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:55:12.063' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (468, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T04:55:12.133' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (469, 2, CAST(60000.00 AS Decimal(10, 2)), N'+60000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:57:26.073' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (470, 2, CAST(60000.00 AS Decimal(10, 2)), N'-60000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T04:57:26.103' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (471, 2, CAST(40000.00 AS Decimal(10, 2)), N'+40000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T05:20:48.863' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (472, 2, CAST(40000.00 AS Decimal(10, 2)), N'-40000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T05:20:48.890' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (473, 2, CAST(80000.00 AS Decimal(10, 2)), N'-80000.0', N'Thanh toán cho bookingId: 740', CAST(N'2024-12-09T05:32:03.520' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (474, 3, CAST(80000.00 AS Decimal(10, 2)), N'+80000.0', N'Được thanh toán từ bookingId: 740', CAST(N'2024-12-09T05:32:03.570' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (475, 2, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:34:08.793' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (476, 2, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:34:08.820' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (477, 2, CAST(80000.00 AS Decimal(10, 2)), N'+80000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:50:17.857' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (478, 2, CAST(80000.00 AS Decimal(10, 2)), N'-80000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:50:17.897' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (479, 2, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:56:48.430' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (480, 2, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T05:56:48.460' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (481, 2, CAST(600000.00 AS Decimal(10, 2)), N'+600000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:02:31.750' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (482, 2, CAST(600000.00 AS Decimal(10, 2)), N'-600000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:02:31.780' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (483, 2, CAST(80000.00 AS Decimal(10, 2)), N'+80000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:06:23.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (484, 2, CAST(80000.00 AS Decimal(10, 2)), N'-80000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:06:23.793' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (485, 2, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:13:18.213' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (486, 2, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:13:18.247' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (487, 2, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:19:17.950' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (488, 2, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:19:17.977' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (489, 2, CAST(600000.00 AS Decimal(10, 2)), N'+600000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:25:52.713' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (490, 2, CAST(600000.00 AS Decimal(10, 2)), N'-600000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:25:52.743' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (491, 2, CAST(80000.00 AS Decimal(10, 2)), N'+80000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:28:20.763' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (492, 2, CAST(80000.00 AS Decimal(10, 2)), N'-80000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:28:20.797' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (493, 2, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:38:25.123' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (494, 2, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T06:38:25.153' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (495, 2, CAST(160000.00 AS Decimal(10, 2)), N'+160000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:41:42.797' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (496, 2, CAST(160000.00 AS Decimal(10, 2)), N'-160000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T06:41:42.823' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (497, 2, CAST(40000.00 AS Decimal(10, 2)), N'-40000.0', N'Thanh toán cho bookingId: 750', CAST(N'2024-12-09T14:53:07.047' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (498, 3, CAST(40000.00 AS Decimal(10, 2)), N'+40000.0', N'Được thanh toán từ bookingId: 750', CAST(N'2024-12-09T14:53:07.100' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (499, 2, CAST(40000.00 AS Decimal(10, 2)), N'+40000.0', N'Hoàn tiền từ bookingId: 750', CAST(N'2024-12-09T14:56:18.440' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (500, 3, CAST(40000.00 AS Decimal(10, 2)), N'-40000.0', N'Hoàn tiền cho bookingId: 750', CAST(N'2024-12-09T14:56:18.520' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (501, 3, CAST(60000.00 AS Decimal(10, 2)), N'+60000.0', N'Hoàn tiền từ bookingId: 749', CAST(N'2024-12-09T14:55:39.447' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (502, 3, CAST(60000.00 AS Decimal(10, 2)), N'-60000.0', N'Hoàn tiền cho bookingId: 749', CAST(N'2024-12-09T14:55:39.557' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (503, 2, CAST(250000.00 AS Decimal(10, 2)), N'+250000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T15:00:44.630' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (504, 2, CAST(250000.00 AS Decimal(10, 2)), N'-250000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T15:00:44.670' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (505, 2, CAST(275000.00 AS Decimal(10, 2)), N'+275000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T15:04:37.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (506, 2, CAST(275000.00 AS Decimal(10, 2)), N'-275000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T15:04:38.027' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (507, 2, CAST(250000.00 AS Decimal(10, 2)), N'+250000.0', N'Hoàn tiền từ bookingId: 751', CAST(N'2024-12-09T15:25:34.470' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (508, 3, CAST(250000.00 AS Decimal(10, 2)), N'-250000.0', N'Hoàn tiền cho bookingId: 751', CAST(N'2024-12-09T15:25:34.567' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (509, 2, CAST(240000.00 AS Decimal(10, 2)), N'+240000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T16:04:14.453' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (510, 2, CAST(240000.00 AS Decimal(10, 2)), N'-240000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T16:04:14.493' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (511, NULL, CAST(5070000.00 AS Decimal(10, 2)), N'+5070000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-09T16:17:06.857' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (512, NULL, CAST(5070000.00 AS Decimal(10, 2)), N'-5070000', N'Thanh toán hóa đơn ', CAST(N'2024-12-09T16:17:06.903' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (513, 2, CAST(240000.00 AS Decimal(10, 2)), N'+240000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:18:37.193' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (514, 2, CAST(240000.00 AS Decimal(10, 2)), N'-240000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:18:37.237' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (515, 2, CAST(240000.00 AS Decimal(10, 2)), N'+240000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:30:12.297' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (516, 2, CAST(240000.00 AS Decimal(10, 2)), N'-240000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:30:12.347' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (517, 2, CAST(450000.00 AS Decimal(10, 2)), N'+450000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T16:37:38.637' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (518, 2, CAST(450000.00 AS Decimal(10, 2)), N'-450000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-09T16:37:38.670' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (519, 2, CAST(120000.00 AS Decimal(10, 2)), N'+120000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:39:19.247' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (520, 2, CAST(120000.00 AS Decimal(10, 2)), N'-120000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T16:39:19.273' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (521, 4, CAST(675000.00 AS Decimal(10, 2)), N'+675000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T17:27:28.297' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (522, 4, CAST(675000.00 AS Decimal(10, 2)), N'-675000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T17:27:28.473' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (523, 4, CAST(157500.00 AS Decimal(10, 2)), N'+157500', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T17:30:54.940' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (524, 4, CAST(157500.00 AS Decimal(10, 2)), N'-157500', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-09T17:30:55.027' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (525, 4, CAST(180000.00 AS Decimal(10, 2)), N'-180000.0', N'Thanh toán cho bookingId: 763', CAST(N'2024-12-09T22:31:02.810' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (526, 5, CAST(180000.00 AS Decimal(10, 2)), N'+180000.0', N'Được thanh toán từ bookingId: 763', CAST(N'2024-12-09T22:31:02.827' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (527, 20, CAST(60000.00 AS Decimal(10, 2)), N'+60000.0', N'Hoàn tiền từ bookingId: 764', CAST(N'2024-12-10T03:20:12.203' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (528, 12, CAST(60000.00 AS Decimal(10, 2)), N'-60000.0', N'Hoàn tiền cho bookingId: 764', CAST(N'2024-12-10T03:20:12.250' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (529, 20, CAST(60000.00 AS Decimal(10, 2)), N'+60000.0', N'Hoàn tiền từ bookingId: 765', CAST(N'2024-12-10T03:20:16.197' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (530, 3, CAST(60000.00 AS Decimal(10, 2)), N'-60000.0', N'Hoàn tiền cho bookingId: 765', CAST(N'2024-12-10T03:20:16.213' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (531, 4, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 768', CAST(N'2024-12-11T13:55:56.697' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (532, 3, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 768', CAST(N'2024-12-11T13:55:56.787' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (533, 4, CAST(1298000.00 AS Decimal(10, 2)), N'+1298000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-11T14:19:30.323' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (534, 4, CAST(1298000.00 AS Decimal(10, 2)), N'-1298000', N'Thanh toán hóa đơn ', CAST(N'2024-12-11T14:19:30.363' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (535, 4, CAST(1258000.00 AS Decimal(10, 2)), N'-1258000.0', N'Thanh toán hóa đơn: 217', CAST(N'2024-12-11T14:25:54.923' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (536, 3, CAST(1258000.00 AS Decimal(10, 2)), N'+1258000.0', N'Từ hóa đơn: 217', CAST(N'2024-12-11T14:25:55.013' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (537, 4, CAST(649000.00 AS Decimal(10, 2)), N'+649000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-11T14:36:24.750' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (538, 4, CAST(649000.00 AS Decimal(10, 2)), N'-649000', N'Thanh toán hóa đơn ', CAST(N'2024-12-11T14:36:24.783' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (539, 4, CAST(450000.00 AS Decimal(10, 2)), N'+450000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-11T14:37:52.133' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (540, 4, CAST(450000.00 AS Decimal(10, 2)), N'-450000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-11T14:37:52.173' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (541, 4, CAST(550000.00 AS Decimal(10, 2)), N'+550000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-11T14:52:08.777' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (542, 4, CAST(550000.00 AS Decimal(10, 2)), N'-550000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-11T14:52:08.813' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (543, 4, CAST(8716000.00 AS Decimal(10, 2)), N'-8716000.0', N'Thanh toán hóa đơn: 219', CAST(N'2024-12-11T16:10:01.917' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (544, 3, CAST(8716000.00 AS Decimal(10, 2)), N'+8716000.0', N'Từ hóa đơn: 219', CAST(N'2024-12-11T16:10:02.027' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (545, 2, CAST(3487000.00 AS Decimal(10, 2)), N'+3487000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-13T00:35:40.270' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (546, 2, CAST(3487000.00 AS Decimal(10, 2)), N'-3487000', N'Thanh toán hóa đơn ', CAST(N'2024-12-13T00:35:40.303' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (547, 2, CAST(599000.00 AS Decimal(10, 2)), N'-599000.0', N'Thanh toán hóa đơn: 221', CAST(N'2024-12-13T00:54:38.827' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (548, 3, CAST(599000.00 AS Decimal(10, 2)), N'+599000.0', N'Từ hóa đơn: 221', CAST(N'2024-12-13T00:54:38.893' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (549, 4, CAST(250000.00 AS Decimal(10, 2)), N'-250000.0', N'Thanh toán cho bookingId: 774', CAST(N'2024-12-13T15:33:43.870' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (550, 3, CAST(250000.00 AS Decimal(10, 2)), N'+250000.0', N'Được thanh toán từ bookingId: 774', CAST(N'2024-12-13T15:33:43.927' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (551, 4, CAST(250000.00 AS Decimal(10, 2)), N'+250000.0', N'Hoàn tiền từ bookingId: 774', CAST(N'2024-12-13T15:34:13.943' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (552, 3, CAST(250000.00 AS Decimal(10, 2)), N'-250000.0', N'Hoàn tiền cho bookingId: 774', CAST(N'2024-12-13T15:34:14.013' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (553, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 775', CAST(N'2024-12-13T16:16:49.020' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (554, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 775', CAST(N'2024-12-13T16:16:49.107' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (555, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Hoàn tiền từ bookingId: 775', CAST(N'2024-12-13T16:17:05.477' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (556, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Hoàn tiền cho bookingId: 775', CAST(N'2024-12-13T16:17:05.543' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (557, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 776', CAST(N'2024-12-13T16:18:40.137' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (558, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 776', CAST(N'2024-12-13T16:18:40.183' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (559, 3, CAST(105000.00 AS Decimal(10, 2)), N'-105000.0', N'Thanh toán cho bookingId: 777', CAST(N'2024-12-13T16:19:42.443' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (560, 4, CAST(105000.00 AS Decimal(10, 2)), N'+105000.0', N'Được thanh toán từ bookingId: 777', CAST(N'2024-12-13T16:19:42.487' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (561, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Hoàn tiền từ bookingId: 776', CAST(N'2024-12-13T16:20:51.663' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (562, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Hoàn tiền cho bookingId: 776', CAST(N'2024-12-13T16:20:51.740' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (563, 3, CAST(105000.00 AS Decimal(10, 2)), N'+105000.0', N'Hoàn tiền từ bookingId: 777', CAST(N'2024-12-13T16:20:53.400' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (564, 4, CAST(105000.00 AS Decimal(10, 2)), N'-105000.0', N'Hoàn tiền cho bookingId: 777', CAST(N'2024-12-13T16:20:53.463' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (565, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 778', CAST(N'2024-12-13T16:21:20.523' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (566, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 778', CAST(N'2024-12-13T16:21:20.573' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (567, 3, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Hoàn tiền từ bookingId: 778', CAST(N'2024-12-13T16:22:20.253' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (568, 4, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Hoàn tiền cho bookingId: 778', CAST(N'2024-12-13T16:22:20.320' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (569, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 779', CAST(N'2024-12-13T16:22:51.970' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (570, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 779', CAST(N'2024-12-13T16:22:52.003' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (571, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 780', CAST(N'2024-12-13T16:25:27.880' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (572, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 780', CAST(N'2024-12-13T16:25:27.927' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (573, 3, CAST(150000.00 AS Decimal(10, 2)), N'-150000.0', N'Thanh toán cho bookingId: 781', CAST(N'2024-12-13T16:26:53.517' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (574, 4, CAST(150000.00 AS Decimal(10, 2)), N'+150000.0', N'Được thanh toán từ bookingId: 781', CAST(N'2024-12-13T16:26:53.567' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (575, 3, CAST(225000.00 AS Decimal(10, 2)), N'-225000.0', N'Thanh toán cho bookingId: 784', CAST(N'2024-12-15T16:49:08.803' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (576, 4, CAST(225000.00 AS Decimal(10, 2)), N'+225000.0', N'Được thanh toán từ bookingId: 784', CAST(N'2024-12-15T16:49:08.880' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (577, 3, CAST(168750.00 AS Decimal(10, 2)), N'+168750.0', N'Hoàn tiền từ bookingId: 784', CAST(N'2024-12-15T16:49:23.683' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (578, 4, CAST(168750.00 AS Decimal(10, 2)), N'-168750.0', N'Hoàn tiền cho bookingId: 784', CAST(N'2024-12-15T16:49:24.010' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (579, 7, CAST(500000.00 AS Decimal(10, 2)), N'+500000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-15T18:46:23.323' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (580, 7, CAST(500000.00 AS Decimal(10, 2)), N'-500000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-15T18:46:23.467' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (581, 7, CAST(671634.00 AS Decimal(10, 2)), N'+671634', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-15T19:12:31.657' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (582, 7, CAST(671634.00 AS Decimal(10, 2)), N'-671634', N'Thanh toán hóa đơn ', CAST(N'2024-12-15T19:12:31.783' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (583, 7, CAST(6490000.00 AS Decimal(10, 2)), N'+6490000', N'Nạp từ hóa đơn thanh toán bằng:  (MoMo)', CAST(N'2024-12-15T19:28:48.757' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (584, 7, CAST(6490000.00 AS Decimal(10, 2)), N'-6490000', N'Thanh toán hóa đơn: ', CAST(N'2024-12-15T19:28:48.897' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (585, 7, CAST(6490000.00 AS Decimal(10, 2)), N'+6490000.0', N'Hoàn trả từ hóa đơn: 234', CAST(N'2024-12-15T19:34:00.790' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (586, 7, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán cho bookingId: 804', CAST(N'2024-12-16T18:16:48.253' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (587, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Được thanh toán từ bookingId: 804', CAST(N'2024-12-16T18:16:48.327' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (588, 7, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'Hoàn tiền từ bookingId: 804', CAST(N'2024-12-16T18:19:10.640' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (589, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Hoàn tiền cho bookingId: 804', CAST(N'2024-12-16T18:19:10.703' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (590, 7, CAST(20000.00 AS Decimal(10, 2)), N'+20000.0', N'Bạn vừa nạp tiền vào ví tài khoản!', CAST(N'2024-12-16T18:20:44.693' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (591, 2, CAST(2160100.00 AS Decimal(10, 2)), N'+2160100', N'Nạp từ hóa đơn thanh toán bằng:  (MoMo)', CAST(N'2024-12-16T18:32:48.127' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (592, 2, CAST(2160100.00 AS Decimal(10, 2)), N'-2160100', N'Thanh toán hóa đơn: ', CAST(N'2024-12-16T18:32:48.157' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (593, 4, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 805', CAST(N'2024-12-16T23:28:19.990' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (594, 16, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 805', CAST(N'2024-12-16T23:28:20.037' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (595, 4, CAST(190000.00 AS Decimal(10, 2)), N'+190000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-17T00:53:16.357' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (596, 4, CAST(190000.00 AS Decimal(10, 2)), N'-190000', N'Thanh toán hóa đơn ', CAST(N'2024-12-17T00:53:16.547' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (597, 4, CAST(60000.00 AS Decimal(10, 2)), N'-60000.0', N'Thanh toán cho bookingId: 813', CAST(N'2024-12-17T00:54:07.723' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (598, 3, CAST(60000.00 AS Decimal(10, 2)), N'+60000.0', N'Được thanh toán từ bookingId: 813', CAST(N'2024-12-17T00:54:07.770' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (599, 4, CAST(400000.00 AS Decimal(10, 2)), N'+400000', N'Nạp từ hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-17T00:54:59.573' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (600, 4, CAST(400000.00 AS Decimal(10, 2)), N'-400000', N'Thanh toán hóa đơn đặt sân: (VNPay)', CAST(N'2024-12-17T00:54:59.603' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (601, 3, CAST(300000.00 AS Decimal(10, 2)), N'-300000.0', N'Thanh toán cho bookingId: 815', CAST(N'2024-12-17T01:09:26.097' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (602, 4, CAST(300000.00 AS Decimal(10, 2)), N'+300000.0', N'Được thanh toán từ bookingId: 815', CAST(N'2024-12-17T01:09:26.140' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (603, 3, CAST(480000.00 AS Decimal(10, 2)), N'-480000.0', N'Thanh toán cho bookingId: 816', CAST(N'2024-12-17T01:15:21.423' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (604, 4, CAST(480000.00 AS Decimal(10, 2)), N'+480000.0', N'Được thanh toán từ bookingId: 816', CAST(N'2024-12-17T01:15:21.453' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (605, 7, CAST(225000.00 AS Decimal(10, 2)), N'-225000.0', N'Thanh toán cho bookingId: 817', CAST(N'2024-12-17T11:18:49.780' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (606, 4, CAST(225000.00 AS Decimal(10, 2)), N'+225000.0', N'Được thanh toán từ bookingId: 817', CAST(N'2024-12-17T11:18:49.827' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (607, 3, CAST(200000.00 AS Decimal(10, 2)), N'-200000.0', N'Thanh toán gia hạn gói tài khoản: Gói nâng cao', CAST(N'2024-12-17T11:39:58.130' AS DateTime))
GO
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (608, 3, CAST(200000.00 AS Decimal(10, 2)), N'+200000.0', N'myntd thanh toán gói Gói nâng cao', CAST(N'2024-12-17T11:39:58.190' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (609, 3, CAST(225000.00 AS Decimal(10, 2)), N'-225000.0', N'Thanh toán cho bookingId: 818', CAST(N'2024-12-17T12:16:08.163' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (610, 4, CAST(225000.00 AS Decimal(10, 2)), N'+225000.0', N'Được thanh toán từ bookingId: 818', CAST(N'2024-12-17T12:16:08.243' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (611, 3, CAST(1300000.00 AS Decimal(10, 2)), N'+1300000', N'Nạp từ hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-17T12:18:07.523' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (612, 3, CAST(1300000.00 AS Decimal(10, 2)), N'-1300000', N'Thanh toán hóa đơn đặt sân: (MoMo)', CAST(N'2024-12-17T12:18:07.583' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (613, 7, CAST(144000.00 AS Decimal(10, 2)), N'-144000.0', N'Thanh toán cho bookingId: 821', CAST(N'2024-12-17T13:21:46.270' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (614, 4, CAST(144000.00 AS Decimal(10, 2)), N'+144000.0', N'Được thanh toán từ bookingId: 821', CAST(N'2024-12-17T13:21:46.367' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (615, 4, CAST(2360000.00 AS Decimal(10, 2)), N'+2360000', N'Nạp từ hóa đơn thanh toán bằng  (VNPay)', CAST(N'2024-12-17T13:35:54.960' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (616, 4, CAST(2360000.00 AS Decimal(10, 2)), N'-2360000', N'Thanh toán hóa đơn ', CAST(N'2024-12-17T13:35:55.003' AS DateTime))
INSERT [dbo].[Transactions] ([Transaction_Id], [Wallet_Id], [Amount], [Transaction_Type], [Description], [Created_At]) VALUES (617, 4, CAST(2360000.00 AS Decimal(10, 2)), N'+2360000.0', N'Hoàn trả từ hóa đơn: 247', CAST(N'2024-12-17T13:37:21.910' AS DateTime))
SET IDENTITY_INSERT [dbo].[Transactions] OFF
GO
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'100928486128195800698', N'Ngân Vũ', N'123', 1, CAST(N'2024-11-27' AS Date), NULL, N'', N'ntdieumy204@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'101794343374621971017', N'Tấn Thành Võ', N'123', 0, CAST(N'2024-11-27' AS Date), NULL, N'', N'nguoikha@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'104473904982469285327', N'Nguyen Tu (FPL HCM)', N'123', 0, CAST(N'2024-11-17' AS Date), NULL, N'', N'tunps31013@fpt.edu.vn', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'107603460251462154012', N'Tú Nguyễn', N'123', 1, CAST(N'2024-11-14' AS Date), NULL, N'', N'nguyentuakinapy@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'116043414437118260556', N'Nguyễn Tú', N'123', 1, CAST(N'2024-12-03' AS Date), 0, NULL, N'tunps31013@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'admin', N'Nguyen Van D', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-09-15' AS Date), 0, NULL, N'admin@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'chusan', N'Thanh Trúc', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 0, CAST(N'2024-09-15' AS Date), 1, NULL, N'ntdieumy204@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'devka123', N'Nguyễn Phùng Hi', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-12-10' AS Date), NULL, NULL, N'hungnpps30910@fpt.edu.vn', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'dieumy', N'Nguyễn Thị Mỹ Diệu', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-10-29' AS Date), NULL, NULL, N'my@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'huuthanh', N'Hoàng Hữu Thành', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-10-29' AS Date), NULL, NULL, N'huuthanh@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'mapogoAdmin', N'Mapogo', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-12-09' AS Date), NULL, NULL, N'mapogosport@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'myntd', N'Nguyễn Thị Diệu Mỵ', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-09-15' AS Date), 1, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1734770944/ykivyl5g456f89cg6bsh.jpg', N'myntdps30740@fpt.edu.vn', CAST(N'2004-04-25' AS Date))
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'nguyenthanhtu', N'Nguyễn Thanh Tú', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-11-09' AS Date), NULL, N'', N'nguyentuakinatiktok1@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'nguyentuakina', N'Nguyễn Tú Akina', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-09-15' AS Date), 0, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732900486/ghem9iuda5kk888a5kfu.jpg', N'nguyentuakina@gmail.com', CAST(N'2004-07-13' AS Date))
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'nguyentuakina123', N'Nguyễn Tú', N'7a445e1eefaf8d9f89a801d1951fff329e8b6510563611a3c755dd0df53141d0', 1, CAST(N'2024-11-17' AS Date), NULL, N'', N'tunps31013@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'nguyentuakinapy', N'Nguyễn Thanh Tú', N'5fa6b9fb1bdc6f91e84673bb7be5c6813b3134607dcd4a5427bf33e1b8707789', 1, CAST(N'2024-10-16' AS Date), 0, NULL, N'nguyentuakinapy@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'nhanvien', N'Nguyen Van C', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-09-15' AS Date), 0, NULL, N'nhanvien@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'phihung', N'Nguyễn Phùng Hi', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-11-02' AS Date), 2, N'https://res.cloudinary.com/disnzpdvj/image/upload/v1732702834/ksfj2bgwsspep8me5pgz.gif', N'phihung.devka@gmail.com', CAST(N'2004-01-03' AS Date))
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'quocanh', N'Nguyễn Võ Quốc Anh', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-10-29' AS Date), NULL, NULL, N'abc.gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'sportoffline', N'Offline', N'123', 0, CAST(N'2024-10-20' AS Date), NULL, NULL, N'sportofffline@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'tanthanh', N'Võ Tấn Thành', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-09-15' AS Date), 0, NULL, N'admin@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'truonglt', N'Le Thanh truong', N'add14b195df50e03005f5c39c952850ce9f1d12156ab681d8485e4b3cdf9f5d0', 1, CAST(N'2024-12-10' AS Date), NULL, NULL, N'truongltps30682@fpt.edu.vn', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'tuakina', N'Tú', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-12-03' AS Date), NULL, NULL, N'tanthanhv22@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'tuakinapy', N'Nguyễn Tú', N'32c9122667fa326b0b83a31a60c659e4ec8ca68c7554601a1dd069a75c32ee83', 1, CAST(N'2024-12-16' AS Date), NULL, NULL, N'nguyentuakinapy13072006@gmail.com', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'tufpt', N'Nguyễn Tú Fpoly', N'b87b7b021e879e1259a7c0cfd6c4f02e3659d42b76bc7d76ce2b4766c68d1e5e', 1, CAST(N'2024-10-29' AS Date), NULL, N'', N'tunps31013@fpt.edu.vn', NULL)
INSERT [dbo].[Users] ([Username], [Fullname], [Password], [Enabled], [Created_At], [Gender], [Avatar], [Email], [Birthday]) VALUES (N'tupy123', N'Tú Py', N'c8296d84bdb6a1d56f56d41e36722b6bd7ec87d315a1c36adaf79f9f0d65ed36', 1, CAST(N'2024-12-15' AS Date), NULL, NULL, N'nguyentuakinapy13072005@gmail.com', NULL)
GO
SET IDENTITY_INSERT [dbo].[UserSubscriptions] ON 

INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (2, 1, N'nguyentuakina', CAST(N'2024-12-03' AS Date), CAST(N'2024-12-03' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (4, 1, N'myntd', CAST(N'2024-12-17' AS Date), CAST(N'2024-12-17' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (10, 1, N'nguyentuakinapy', CAST(N'2024-11-17' AS Date), CAST(N'2024-11-17' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (11, 1, N'nguyentuakina123', CAST(N'2024-11-17' AS Date), CAST(N'2024-11-17' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (12, 2, N'100928486128195800698', CAST(N'2024-11-27' AS Date), CAST(N'2024-12-30' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (36, 1, N'chusan', CAST(N'2024-12-03' AS Date), CAST(N'2024-12-03' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (37, 1, N'116043414437118260556', CAST(N'2024-12-03' AS Date), CAST(N'2024-12-03' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (43, 1, N'tupy123', CAST(N'2024-12-15' AS Date), CAST(N'2024-12-15' AS Date), N'Đã thanh toán')
INSERT [dbo].[UserSubscriptions] ([User_Subscription_Id], [Account_Package_Id], [Username], [Start_Day], [End_Day], [Status]) VALUES (44, 2, N'tuakinapy', CAST(N'2024-12-16' AS Date), CAST(N'2025-01-15' AS Date), N'Đã thanh toán')
SET IDENTITY_INSERT [dbo].[UserSubscriptions] OFF
GO
SET IDENTITY_INSERT [dbo].[UserVoucher] ON 

INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (20, N'myntd', 4, CAST(N'2024-12-08T21:45:21.823' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (21, N'myntd', 2, CAST(N'2024-12-08T22:02:41.233' AS DateTime), N'Used')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (22, N'myntd', 1, CAST(N'2024-12-08T22:02:45.027' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (23, N'truonglt', 4, CAST(N'2024-12-10T03:28:30.487' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (24, N'truonglt', 2, CAST(N'2024-12-10T03:28:34.643' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (25, N'nguyentuakina', 2, CAST(N'2024-12-11T14:17:02.737' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (26, N'nguyentuakina', 1, CAST(N'2024-12-13T14:24:58.107' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (27, N'phihung', 2, CAST(N'2024-12-13T15:32:19.593' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (28, N'phihung', 1, CAST(N'2024-12-13T15:33:56.107' AS DateTime), N'Used')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (29, N'myntd', 21, CAST(N'2024-12-16T18:29:09.083' AS DateTime), N'Used')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (30, N'chusan', 25, CAST(N'2024-12-16T18:30:43.133' AS DateTime), N'Used')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (31, N'chusan', 26, CAST(N'2024-12-17T08:52:39.687' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (32, N'chusan', 23, CAST(N'2024-12-17T08:52:43.007' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (33, N'chusan', 21, CAST(N'2024-12-17T08:52:50.837' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (34, N'phihung', 27, CAST(N'2024-12-25T00:57:36.850' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (35, N'phihung', 26, CAST(N'2024-12-25T00:57:41.620' AS DateTime), N'Unused')
INSERT [dbo].[UserVoucher] ([User_Voucher_Id], [Username], [Voucher_Id], [Date], [Status]) VALUES (36, N'phihung', 21, CAST(N'2024-12-25T00:57:44.440' AS DateTime), N'Unused')
SET IDENTITY_INSERT [dbo].[UserVoucher] OFF
GO
SET IDENTITY_INSERT [dbo].[Voucher] ON 

INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (1, N'Giảm giá 10%', 10, 12, CAST(N'2024-10-01T00:00:00.000' AS DateTime), CAST(N'2025-01-01T07:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-10-28T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (2, N'Giảm giá 10%', 10, 13, CAST(N'2024-10-01T00:00:00.000' AS DateTime), CAST(N'2024-12-31T00:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-10-01T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (3, N'Giảm giá 20%', 20, 48, CAST(N'2024-10-01T00:00:00.000' AS DateTime), CAST(N'2024-11-30T00:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNT20', CAST(N'2024-10-01T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (4, N'Giảm giá 15%', 15, 21, CAST(N'2024-10-01T00:00:00.000' AS DateTime), CAST(N'2024-12-15T07:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNTCODE-15', CAST(N'2024-10-01T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (5, N'Giảm giá 25%', 25, 14, CAST(N'2024-10-01T00:00:00.000' AS DateTime), CAST(N'2024-12-16T07:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNTCODE-25', CAST(N'2024-10-01T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (6, N'Ưu đãi tháng 52', 60, 10, CAST(N'2024-11-15T00:00:00.000' AS DateTime), CAST(N'2024-12-15T00:00:00.000' AS DateTime), N'chusan', N'inactive', N'DISCOUNT50', CAST(N'2024-11-14T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (7, N'dsdsd', 10, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-23T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (8, N'Mã giảm tháng 1', 1, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-23T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-1', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (9, N'Mã giảm tháng 2', 10, 10, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-25T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (10, N'Mã giảm tháng 3', 1, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-26T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-1', CAST(N'2024-12-24T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (11, N'Mã giảm tháng 12', 1, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2025-01-03T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-1', CAST(N'2024-12-13T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (12, N'Mã giảm tháng 11', 40, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2025-01-01T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-40', CAST(N'2024-12-13T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (13, N'Mã giảm tháng 10', 1, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-14T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-1', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (14, N'Mã giảm tháng 09', 20, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-26T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-20', CAST(N'2024-12-14T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (15, N'Mã giảm tháng 08', 16, 20, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-23T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-16', CAST(N'2024-12-13T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (16, N'Mã giảm tháng 07', 17, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-23T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-17', CAST(N'2024-12-14T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (17, N'Mã giảm tháng 06', 19, 1, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-13T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-19', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (18, N'Mã giảm 009', 9, 9, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-13T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-9', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (19, N'Mã giảm 008', 50, 88, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-30T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-50', CAST(N'2024-12-13T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (20, N'Mã giảm 007', 7, 77, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-17T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-7', CAST(N'2024-12-13T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (21, N'Mã giảm 006', 60, 63, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-31T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-60', CAST(N'2024-12-14T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (22, N'Mã giảm 005', 5, 5, CAST(N'2024-12-13T00:00:00.000' AS DateTime), CAST(N'2024-12-15T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-5', CAST(N'2024-12-14T07:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (23, N'Mã giảm tháng 004', 40, 90, CAST(N'2024-12-14T00:00:00.000' AS DateTime), CAST(N'2024-12-24T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-40', CAST(N'2024-12-14T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (24, N'Mã giảm giá khai trương', 10, 100, CAST(N'2024-12-14T00:00:00.000' AS DateTime), CAST(N'2024-12-16T07:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-12-14T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (25, N'Mã giảm khai trương 3', 10, 9, CAST(N'2024-12-14T00:00:00.000' AS DateTime), CAST(N'2024-12-17T00:00:00.000' AS DateTime), N'nguyentuakina', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-12-16T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (26, N'giảm 10%', 10, 89, CAST(N'2024-12-16T00:00:00.000' AS DateTime), CAST(N'2024-12-31T00:00:00.000' AS DateTime), N'myntd', N'inactive', N'DISCOUNTCODE-10', CAST(N'2024-12-16T00:00:00.000' AS DateTime))
INSERT [dbo].[Voucher] ([Voucher_Id], [Name], [Discount_Percent], [Quantity], [Create_Date], [End_Date], [Created_By], [Status], [Discount_Code], [Active_Date]) VALUES (27, N'giảm giá tháng 12', 12, 119, CAST(N'2024-12-17T00:00:00.000' AS DateTime), CAST(N'2024-12-27T00:00:00.000' AS DateTime), N'myntd', N'inactive', N'DISCOUNTCODE-12', CAST(N'2024-12-17T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Voucher] OFF
GO
SET IDENTITY_INSERT [dbo].[Wallets] ON 

INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (1, N'admin', CAST(9999999.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (2, N'chusan', CAST(209000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (3, N'myntd', CAST(129472362.40 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (4, N'nguyentuakina', CAST(53348479.60 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (5, N'nguyentuakinapy', CAST(300000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (6, N'nhanvien', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (7, N'phihung', CAST(8778301.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (8, N'tanthanh', CAST(120000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (9, N'tufpt', CAST(100000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (10, N'sportoffline', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (11, N'107603460251462154012', CAST(23325403.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (12, N'nguyentuakina123', CAST(40000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (13, N'104473904982469285327', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (14, N'nguyenthanhtu', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (15, N'101794343374621971017', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (16, N'100928486128195800698', CAST(37602500.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (17, N'116043414437118260556', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (18, N'tuakina', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (20, N'truonglt', CAST(120000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (21, N'devka123', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (23, N'dieumy', CAST(2000000.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (24, N'tupy123', CAST(0.00 AS Decimal(12, 2)))
INSERT [dbo].[Wallets] ([Wallet_Id], [Username], [Balance]) VALUES (25, N'tuakinapy', CAST(0.00 AS Decimal(12, 2)))
SET IDENTITY_INSERT [dbo].[Wallets] OFF
GO
/****** Object:  Index [UQ__AccountP__3CE6357A67E389E8]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[AccountPackageBenefit] ADD UNIQUE NONCLUSTERED 
(
	[Account_Package_Benefit_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__AccountP__16A876CC8CB3AA34]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[AccountPackages] ADD UNIQUE NONCLUSTERED 
(
	[Account_Package_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Address__03BDEBBB8159939D]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Address] ADD UNIQUE NONCLUSTERED 
(
	[Address_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__AddressU__83D371704D6E7BC3]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[AddressUser] ADD UNIQUE NONCLUSTERED 
(
	[Address_User_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Authorit__BA8F501566401981]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Authorities] ADD UNIQUE NONCLUSTERED 
(
	[Authority_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Benefits__E7342AE99D21AEB0]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Benefits] ADD UNIQUE NONCLUSTERED 
(
	[Benefit_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BlogImag__6B28B349376C8534]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[BlogImages] ADD UNIQUE NONCLUSTERED 
(
	[Blog_Image_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BlogPost__1C4B162F8E698E66]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[BlogPosts] ADD UNIQUE NONCLUSTERED 
(
	[Blog_Post_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BookingD__AADFA4D804291C0C]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[BookingDetails] ADD UNIQUE NONCLUSTERED 
(
	[Booking_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__BookingP__CC5CE95E7CC32EAD]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[BookingPayments] ADD UNIQUE NONCLUSTERED 
(
	[Booking_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Bookings__35ABFDC17746CB90]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Bookings] ADD UNIQUE NONCLUSTERED 
(
	[Booking_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Carts__D6AB475829A521F7]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Carts] ADD UNIQUE NONCLUSTERED 
(
	[Cart_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Categori__2EC51214C656EEBA]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[CategoriesField] ADD UNIQUE NONCLUSTERED 
(
	[Categories_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Categori__B96A8F5E598C9ED1]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[CategoriesProduct] ADD UNIQUE NONCLUSTERED 
(
	[Category_Product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Favorite__324587F3FDFE0143]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[FavoriteFields] ADD UNIQUE NONCLUSTERED 
(
	[Favorite_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__FieldRev__D60E6A4E9B78218F]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[FieldReviews] ADD UNIQUE NONCLUSTERED 
(
	[Field_Review_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Gallery__40415A96DD13ADDC]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Gallery] ADD UNIQUE NONCLUSTERED 
(
	[Gallery_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__OrderDet__1581C7629F00066E]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[OrderDetails] ADD UNIQUE NONCLUSTERED 
(
	[Order_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__OrderPay__F45840B815266C71]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[OrderPayments] ADD UNIQUE NONCLUSTERED 
(
	[Order_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Orders__F1E4607AB2379F71]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Orders] ADD UNIQUE NONCLUSTERED 
(
	[Order_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Owners__BD6352BAF0FE8EB0]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Owners] ADD UNIQUE NONCLUSTERED 
(
	[Owner_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__PaymentM__781302A7CE5D9FC8]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[PaymentMethods] ADD UNIQUE NONCLUSTERED 
(
	[Payment_Method_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__ProductD__7EE52BF2A403E17D]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[ProductDetails] ADD UNIQUE NONCLUSTERED 
(
	[Product_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__ProductD__76CB18EE917148AE]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[ProductDetailSize] ADD UNIQUE NONCLUSTERED 
(
	[Product_Detail_Size_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Productr__F161EEC011285BF6]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Productreviews] ADD UNIQUE NONCLUSTERED 
(
	[Product_Review_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Products__9834FBBB390F9B31]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Products] ADD UNIQUE NONCLUSTERED 
(
	[Product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Roles__D80AB4BA4AA08C9F]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[Role_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Sizes__0BC32561170F8BD4]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Sizes] ADD UNIQUE NONCLUSTERED 
(
	[Size_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__SportFie__6C3F4E86F9DC0344]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[SportFieldDetails] ADD UNIQUE NONCLUSTERED 
(
	[Sport_Fiel_Detail_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__SportFie__5392112FB3BBC53F]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[SportFields] ADD UNIQUE NONCLUSTERED 
(
	[Sport_Field_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Subscrip__56C6D221A1ED9E49]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[SubscriptionPayments] ADD UNIQUE NONCLUSTERED 
(
	[Subscription_Payment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__UserSubs__DF21A7E5FBF9296F]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[UserSubscriptions] ADD UNIQUE NONCLUSTERED 
(
	[User_Subscription_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__UserVouc__8F873E04D55B5618]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[UserVoucher] ADD UNIQUE NONCLUSTERED 
(
	[User_Voucher_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__Voucher__D753917D82F9D693]    Script Date: 1/27/2025 6:51:09 PM ******/
ALTER TABLE [dbo].[Voucher] ADD UNIQUE NONCLUSTERED 
(
	[Voucher_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AccountPackages] ADD  DEFAULT ((0)) FOR [Limit_SportFields]
GO
ALTER TABLE [dbo].[AccountPackages] ADD  DEFAULT ((0)) FOR [Limit_Bookings]
GO
ALTER TABLE [dbo].[AddressUser] ADD  DEFAULT ((0)) FOR [Active]
GO
ALTER TABLE [dbo].[Bookings] ADD  DEFAULT ((0)) FOR [Old_Total_Amount]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT ((0)) FOR [Is_Read]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT (getdate()) FOR [Created_At]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT (getdate()) FOR [Updated_At]
GO
ALTER TABLE [dbo].[PhoneNumberUser] ADD  DEFAULT ((0)) FOR [Active]
GO
ALTER TABLE [dbo].[SportFields] ADD  DEFAULT ('') FOR [Decription]
GO
ALTER TABLE [dbo].[Wallets] ADD  DEFAULT ((0.00)) FOR [Balance]
GO
ALTER TABLE [dbo].[AccountPackageBenefit]  WITH CHECK ADD FOREIGN KEY([Account_Package_Id])
REFERENCES [dbo].[AccountPackages] ([Account_Package_Id])
GO
ALTER TABLE [dbo].[AccountPackageBenefit]  WITH CHECK ADD FOREIGN KEY([Benefit_Id])
REFERENCES [dbo].[Benefits] ([Benefit_Id])
GO
ALTER TABLE [dbo].[AddressUser]  WITH CHECK ADD FOREIGN KEY([Address_Id])
REFERENCES [dbo].[Address] ([Address_Id])
GO
ALTER TABLE [dbo].[AddressUser]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Authorities]  WITH CHECK ADD FOREIGN KEY([Authority])
REFERENCES [dbo].[Roles] ([Role_Id])
GO
ALTER TABLE [dbo].[Authorities]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[BlogImages]  WITH CHECK ADD FOREIGN KEY([Blog_Post_Id])
REFERENCES [dbo].[BlogPosts] ([Blog_Post_Id])
GO
ALTER TABLE [dbo].[BlogPosts]  WITH CHECK ADD FOREIGN KEY([Owner_Id])
REFERENCES [dbo].[Owners] ([Owner_Id])
GO
ALTER TABLE [dbo].[BookingDetails]  WITH CHECK ADD FOREIGN KEY([Booking_Id])
REFERENCES [dbo].[Bookings] ([Booking_Id])
GO
ALTER TABLE [dbo].[BookingDetails]  WITH CHECK ADD FOREIGN KEY([Sport_Field_Detail_Id])
REFERENCES [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id])
GO
ALTER TABLE [dbo].[BookingPayments]  WITH CHECK ADD FOREIGN KEY([Booking_Id])
REFERENCES [dbo].[Bookings] ([Booking_Id])
GO
ALTER TABLE [dbo].[BookingPayments]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([Owner_Id])
REFERENCES [dbo].[Owners] ([Owner_Id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([Payment_Method_Id])
REFERENCES [dbo].[PaymentMethods] ([Payment_Method_Id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([Voucher_Id])
REFERENCES [dbo].[Voucher] ([Voucher_Id])
GO
ALTER TABLE [dbo].[Carts]  WITH CHECK ADD FOREIGN KEY([Product_Detail_Size_Id])
REFERENCES [dbo].[ProductDetailSize] ([Product_Detail_Size_Id])
GO
ALTER TABLE [dbo].[Carts]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[FavoriteFields]  WITH CHECK ADD FOREIGN KEY([Sport_Field_Id])
REFERENCES [dbo].[SportFields] ([Sport_Field_Id])
GO
ALTER TABLE [dbo].[FavoriteFields]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[FieldReviews]  WITH CHECK ADD FOREIGN KEY([Sport_Field_Id])
REFERENCES [dbo].[SportFields] ([Sport_Field_Id])
GO
ALTER TABLE [dbo].[FieldReviews]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Gallery]  WITH CHECK ADD FOREIGN KEY([Product_Detail_Id])
REFERENCES [dbo].[ProductDetails] ([Product_Detail_Id])
GO
ALTER TABLE [dbo].[GallerySportField]  WITH CHECK ADD  CONSTRAINT [FK_GallerySportField_SportFields] FOREIGN KEY([Sport_Field_Id])
REFERENCES [dbo].[SportFields] ([Sport_Field_Id])
GO
ALTER TABLE [dbo].[GallerySportField] CHECK CONSTRAINT [FK_GallerySportField_SportFields]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Receiver] FOREIGN KEY([ReceiverUsername])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Receiver]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Sender] FOREIGN KEY([SenderUsername])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Sender]
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK_Notification_Booking] FOREIGN KEY([Booking_Id])
REFERENCES [dbo].[Bookings] ([Booking_Id])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK_Notification_Booking]
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK_Notification_Order] FOREIGN KEY([Order_Id])
REFERENCES [dbo].[Orders] ([Order_Id])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK_Notification_Order]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([Order_Id])
REFERENCES [dbo].[Orders] ([Order_Id])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([Product_Detail_Size_Id])
REFERENCES [dbo].[ProductDetailSize] ([Product_Detail_Size_Id])
GO
ALTER TABLE [dbo].[OrderPayments]  WITH CHECK ADD FOREIGN KEY([Order_Id])
REFERENCES [dbo].[Orders] ([Order_Id])
GO
ALTER TABLE [dbo].[OrderPayments]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([Payment_Method_Id])
REFERENCES [dbo].[PaymentMethods] ([Payment_Method_Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([Voucher_Id])
REFERENCES [dbo].[Voucher] ([Voucher_Id])
GO
ALTER TABLE [dbo].[Owners]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[PhoneNumberUser]  WITH CHECK ADD FOREIGN KEY([Phone_Number_Id])
REFERENCES [dbo].[PhoneNumbers] ([Phone_Number_Id])
GO
ALTER TABLE [dbo].[PhoneNumberUser]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[ProductDetails]  WITH CHECK ADD FOREIGN KEY([Product_Id])
REFERENCES [dbo].[Products] ([Product_Id])
GO
ALTER TABLE [dbo].[ProductDetailSize]  WITH CHECK ADD FOREIGN KEY([Product_Detail_Id])
REFERENCES [dbo].[ProductDetails] ([Product_Detail_Id])
GO
ALTER TABLE [dbo].[ProductDetailSize]  WITH CHECK ADD FOREIGN KEY([Size_Id])
REFERENCES [dbo].[Sizes] ([Size_Id])
GO
ALTER TABLE [dbo].[Productreviews]  WITH CHECK ADD FOREIGN KEY([Product_Id])
REFERENCES [dbo].[Products] ([Product_Id])
GO
ALTER TABLE [dbo].[Productreviews]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD FOREIGN KEY([Category_Product_Id])
REFERENCES [dbo].[CategoriesProduct] ([Category_Product_Id])
GO
ALTER TABLE [dbo].[SportFieldDetails]  WITH CHECK ADD FOREIGN KEY([Sport_Filed_Id])
REFERENCES [dbo].[SportFields] ([Sport_Field_Id])
GO
ALTER TABLE [dbo].[SportFields]  WITH CHECK ADD FOREIGN KEY([Categories_Field_Id])
REFERENCES [dbo].[CategoriesField] ([Categories_Field_Id])
GO
ALTER TABLE [dbo].[SportFields]  WITH CHECK ADD FOREIGN KEY([Owner_Id])
REFERENCES [dbo].[Owners] ([Owner_Id])
GO
ALTER TABLE [dbo].[StatusSportFieldDetails]  WITH CHECK ADD  CONSTRAINT [FK_SportFieldDetail_Status] FOREIGN KEY([Sport_Fiel_Detail_Id])
REFERENCES [dbo].[SportFieldDetails] ([Sport_Fiel_Detail_Id])
GO
ALTER TABLE [dbo].[StatusSportFieldDetails] CHECK CONSTRAINT [FK_SportFieldDetail_Status]
GO
ALTER TABLE [dbo].[SubscriptionPayments]  WITH CHECK ADD FOREIGN KEY([Payment_Method_Id])
REFERENCES [dbo].[PaymentMethods] ([Payment_Method_Id])
GO
ALTER TABLE [dbo].[SubscriptionPayments]  WITH CHECK ADD FOREIGN KEY([User_Subscription_Id])
REFERENCES [dbo].[UserSubscriptions] ([User_Subscription_Id])
GO
ALTER TABLE [dbo].[SubscriptionPayments]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Transactions]  WITH CHECK ADD FOREIGN KEY([Wallet_Id])
REFERENCES [dbo].[Wallets] ([Wallet_Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserSubscriptions]  WITH CHECK ADD FOREIGN KEY([Account_Package_Id])
REFERENCES [dbo].[AccountPackages] ([Account_Package_Id])
GO
ALTER TABLE [dbo].[UserSubscriptions]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[UserVoucher]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[UserVoucher]  WITH CHECK ADD FOREIGN KEY([Voucher_Id])
REFERENCES [dbo].[Voucher] ([Voucher_Id])
GO
ALTER TABLE [dbo].[Voucher]  WITH CHECK ADD FOREIGN KEY([Created_By])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[Wallets]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Users] ([Username])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[StatusSportFieldDetails]  WITH CHECK ADD  CONSTRAINT [CHK_Dates] CHECK  (([EndDate] IS NULL OR [EndDate]>=[StartDate]))
GO
ALTER TABLE [dbo].[StatusSportFieldDetails] CHECK CONSTRAINT [CHK_Dates]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SportFields', @level2type=N'COLUMN',@level2name=N'Decription'
GO
USE [master]
GO
ALTER DATABASE [FPL_Mapogo_03] SET  READ_WRITE 
GO
