package edu.kaist.salab;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class DependencyVisitor extends ClassVisitor {
    private String classname;

    private static String getModuleName(String classname, String methodName, String methodDescriptor) {
        return classname + "." + methodName + methodDescriptor;
    }

    public DependencyVisitor() {
        super(Opcodes.ASM9);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        classname = name;
    }

    @Override
    public MethodVisitor visitMethod(final int access, final String name, final String descriptor, final String signature, final String[] exceptions) {
        return new MethodDependencyVisitor(getModuleName(this.classname, name, descriptor));
    }

    static class MethodDependencyVisitor extends MethodVisitor {
        private final String caller;

        public MethodDependencyVisitor(String caller) {
            super(Opcodes.ASM9);
            this.caller = caller;
        }

        @Override
        public void visitMethodInsn(final int opcode, final String owner, final String name, final String descriptor, boolean isInterface) {
            String callee = getModuleName(owner, name, descriptor);
            System.out.println("{\"caller\":\"" + this.caller + "\",\"callee\":\"" + callee + "\"}");
        }
    }
}
