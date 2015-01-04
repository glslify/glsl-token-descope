float x;
float z;

struct StructName {
  float x;
  float y;
};

struct StructInline {
  float x;
  float y;
} inlined;

void main() {
  StructName x = StructName(1.0, 0.0);

  inlined.x += 0.5;
  inlined.y -= 0.5;
  x.x += 0.5;
  x.y -= 0.5;

  struct LocalStruct {
    float x;
  } local;

  local.x;
}
