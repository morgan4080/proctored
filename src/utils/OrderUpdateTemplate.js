export default function OrderTemplateHtml(session, orderData) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }
  return `
       
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Order Updated</title>
    <style>
        /* Add your CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #0D5C9D;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .logo {
            width: 80px;
            height: 80px;
            margin-right: 20px;
        }

        .order {
            color: #0D5C9D;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
        }

        span {
            color: #0D5C9D;
            text-decoration: underline;
        }

        .nameteam {
            color: #0D5C9D;
            font-weight: bold;
        }

        .order-details {
            max-width: 400px;
            margin: 0 auto;
            text-align: left;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin-bottom: 20px;
        }

        li {
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            color: #888;
            font-size: 0.9em;
            margin-top: 30px;
        }
        .username{
          font-weight: bold;
         }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
           
            <h1 class="order">Order Updated</h1>
        </div>
        <p class="username">Dear ${session.user.name},</p>
        <p>Thank you for your order. Here are the details:</p>
        <div class="order-details">
            <ul>
                <li><strong>Duration:</strong> ${formatDate(
                  orderData.duration.from,
                )} - ${formatDate(orderData.duration.to)}</li>
                <li><strong>Service:</strong> ${orderData.service}</li>
                <li><strong>Attachments:</strong> ${
                  orderData.attachments.length
                }</li>
                <li><strong>Total Price:</strong>USD ${
                  orderData.totalPrice
                }</li>
                <li><strong>Payment Status:</strong> ${
                  orderData.paymentStatus
                }</li>
            </ul>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.<br>Email: <span>proctorowls@gmail.com</span></p>
        <div class="footer">
            <p class="nameteam">The Proctor Owls Team</p>
            <p>www.proctorowls.com</p>
        </div>
    </div>
</body>
</html>
    `
}
