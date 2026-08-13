from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "images"

JOBS = {
    "hero-banner.png": {"size": (1600, 900), "quality": 72},
    "logo.png": {"size": (256, 256), "quality": 80},
    "favicon.png": {"size": (64, 64), "quality": 80},
    "phone-premium.png": {"size": (800, 800), "quality": 75},
    "phone-gold.png": {"size": (800, 800), "quality": 75},
    "phone-white.png": {"size": (800, 800), "quality": 75},
    "phone-teal.png": {"size": (800, 800), "quality": 75},
    "laptop-premium.png": {"size": (800, 800), "quality": 75},
    "laptop-dark.png": {"size": (800, 800), "quality": 75},
}


def compress(name, opts):
    src = ROOT / name
    if not src.exists():
        print("missing", name)
        return
    img = Image.open(src).convert("RGB")
    img.thumbnail(opts["size"], Image.Resampling.LANCZOS)
    dest = src.with_suffix(".webp")
    img.save(dest, "WEBP", quality=opts["quality"], method=6)
    print(name, src.stat().st_size // 1024, "KB ->", dest.name, dest.stat().st_size // 1024, "KB")


def main():
    for name, opts in JOBS.items():
        compress(name, opts)


if __name__ == "__main__":
    main()
