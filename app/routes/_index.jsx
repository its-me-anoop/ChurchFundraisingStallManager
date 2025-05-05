import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Church Fundraising Stall Manager" },
    { name: "description", content: "Coming Soon" },
  ];
};

export const loader = async () => {
  return json({
    message: "Church Fundraising Stall Manager - Coming Soon",
  });
};

export default function Index() {
  const { message } = useLoaderData();
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ color: "#0284c7", marginTop: "40px" }}>Church Fundraising Stall Manager</h1>
        
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", margin: "20px 0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2>Coming Soon</h2>
          <p>Our stall management application is being prepared for deployment.</p>
          <p>This site will allow church fundraising event organizers to:</p>
          <ul>
            <li>Track sales in real-time</li>
            <li>Manage inventory across multiple stalls</li>
            <li>Generate reports on fundraising performance</li>
            <li>Coordinate seller activities</li>
          </ul>
        </div>
        
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", margin: "20px 0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2>Contact</h2>
          <p>For more information, please contact the system administrator.</p>
        </div>
        
        <footer style={{ marginTop: "40px", textAlign: "center", fontSize: "0.8em", color: "#64748b" }}>
          &copy; 2025 Church Fundraising Stall Manager
        </footer>
      </div>
    </div>
  );
}