<template>
  <div class="page-container">
    
    <AppHeader />

    <main>
      <slot /> 
    </main>

    <footer>
      <p>&copy; 2025 Mein Nuxt Projekt</p>
    </footer>

  </div>
</template>

<style scoped>
/* Ein bisschen CSS, damit es ordentlich aussieht */
nav ul {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  background-color: #f0f0f0;
  padding: 10px;
}
main {
  padding: 20px;
  min-height: 200px;
}
footer {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
}
</style>