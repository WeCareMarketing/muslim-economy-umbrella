// Initialize Supabase
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Sign Up
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert("Sign-up successful! Please check your email for confirmation.");
  }
}

// Sign In
async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert("Login successful!");
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("portfolio-section").classList.remove("hidden");
    document.getElementById("portfolio-list").classList.remove("hidden");
    fetchPortfolios();
  }
}

// Add Portfolio
async function addPortfolio() {
  const amount = document.getElementById("amount").value;
  const duration = document.getElementById("duration").value;

  const user = supabase.auth.user();
  if (!user) {
    alert("Please login first!");
    return;
  }

  const { data, error } = await supabase.from("portfolios").insert([
    {
      user_id: user.id,
      investment_amount: amount,
      investment_duration: duration,
    },
  ]);

  if (error) {
    alert(error.message);
  } else {
    alert("Portfolio added successfully!");
    fetchPortfolios();
  }
}

// Fetch Portfolios
async function fetchPortfolios() {
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    alert(error.message);
  } else {
    const list = document.getElementById("portfolio-display");
    list.innerHTML = "";
    data.forEach((portfolio) => {
      const item = document.createElement("li");
      item.textContent = `Amount: ${portfolio.investment_amount}, Duration: ${portfolio.investment_duration} months`;
      list.appendChild(item);
    });
  }
}
