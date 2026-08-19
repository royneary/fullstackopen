{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";

    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      ...
    }:
    let
      supportedSystems = [
        "x86_64-linux"
      ];

      forAllSystems = f: nixpkgs.lib.genAttrs supportedSystems (system: f system);
    in
    {
      devShell = forAllSystems (
        system:
        let
          overlays = [ ];
          pkgs = import nixpkgs { inherit system overlays; };
          pkgs-unstable = import nixpkgs-unstable { inherit system overlays; };
        in
        pkgs.mkShell {
          name = "javascript devshell";

          buildInputs = with pkgs; [
            nodejs_26
            vscode-langservers-extracted
            typescript-language-server
            prettierd
            pkgs-unstable.playwright-driver.browsers
          ];

          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH=${pkgs-unstable.playwright-driver.browsers}
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
          '';
        }
      );
    };
}
