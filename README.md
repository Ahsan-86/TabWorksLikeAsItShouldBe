# Tab Works Like As It Should Be – Obsidian Plugin

This Obsidian plugin makes tab behavior work as it should be.  

- **Tab** → inserts a literal tab character `\t`
- **Shift+Tab** → removes one leading tab from all selected lines

## 📥 Installation

### 🔹 For Users (Manual Install)
1. **Download the Plugin**
   - Go to this repository’s [Releases](../../releases) page.
   - Download the latest release ZIP.

2. **Extract and Copy**
   - Unzip the folder.
   - Copy the entire folder `TabWorksLikeAsItShouldBe` into:
     ```
     <YourVault>/.obsidian/plugins/
     ```

3. **Enable in Obsidian**
   - Restart Obsidian.
   - Go to **Settings → Community plugins**.
   - Enable **TabWorksLikeAsItShouldBe**.

---

### 🔹 For Developers (Build from Source)
1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/TabWorksLikeAsItShouldBe.git
   cd TabWorksLikeAsItShouldBe
   npm install
   npm run build
   npm run dev

---

### 🔹 Repository Structure
    main.ts – Source code (TypeScript).
    main.js – Compiled plugin code (used by Obsidian).
    manifest.json – Plugin metadata (ID, version, author, description).
    versions.json – Obsidian compatibility versions.
    tsconfig.json – TypeScript config.
    package.json – Dependencies & build scripts.

---

### 🔹 Notes
    The plugin is not yet available in the official Obsidian Community Plugins store.
    Users must install it manually until then.
    This plugin has only been developed and tested on Windows.
    If you’re on macOS or Linux, it may still work, but hasn’t been tested yet.
    Contributions to improve cross-platform support are welcome.

---

### 🔹 Contributing
This is a public repository and contributions are very welcome!

You can help by:
Reporting issues
Submitting pull requests for bug fixes or improvements
Adding cross-platform support (macOS, Linux)

**How to Contribute**
    Fork this repository.
    Create a new branch.
    Make your changes.
    Commit.
    Push to your branch.
    Open a Pull Request.


