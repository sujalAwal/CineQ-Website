const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'src/app/shared/components/navbar/navbar.component.ts',
    templateUrl: './navbar.component.html'
  },
  {
    path: 'src/app/shared/components/login-modal/login-modal.component.ts',
    templateUrl: './login-modal.component.html'
  },
  {
    path: 'src/app/shared/components/footer/footer.component.ts',
    templateUrl: './footer.component.html'
  },
  {
    path: 'src/app/shared/components/movie-card/movie-card.component.ts',
    templateUrl: './movie-card.component.html'
  },
  {
    path: 'src/app/shared/components/toast/toast.component.ts',
    templateUrl: './toast.component.html'
  },
  {
    path: 'src/app/features/movies/movies.component.ts',
    templateUrl: './movies.component.html'
  },
  {
    path: 'src/app/features/coming-soon/coming-soon.component.ts',
    templateUrl: './coming-soon.component.html'
  },
  {
    path: 'src/app/app.ts',
    templateUrl: './app.html'
  }
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file.path} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace template: `...` with templateUrl: '...'
  // Match from template: to the closing backtick, handling nested backticks in template literals
  content = content.replace(
    /template:\s*`[\s\S]*?`(?=\s*,|\s*\})/,
    `templateUrl: '${file.templateUrl}'`
  );
  
  // Remove styles: [] line
  content = content.replace(/,?\s*styles:\s*\[\s*\]\s*(?=\n|$)/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`UPDATED: ${file.path}`);
});

console.log('\nAll component files have been updated!');
